import os
import json
import re
from datetime import datetime
from collections import Counter
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache
from geopy.geocoders import Nominatim

# Путь к data/jobs.json
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "jobs.json")

# Инициализация FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Геокодер для перевода названия города в координаты
geolocator = Nominatim(user_agent="job_service")

# «Шумовые» слова, которые не считаем навыками
STOPWORDS = {
    'и','в','на','с','по','для','от','до','это','как','что','к','за','со',
    'опыт','лет','работы','должен','знание','знания','умение','умения',
    'образование','высшее','минимум','обязанности','требования'
}

@lru_cache()
def load_jobs():
    """Читает JSON-файл и возвращает список вакансий."""
    with open(DATA_PATH, encoding="utf-8") as f:
        return json.load(f)

@app.post("/api/scrape")
def scrape():
    """Триггер для повторного скрапинга вакансий."""
    from .scraper import scrape_jobs
    jobs = scrape_jobs()
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
    load_jobs.cache_clear()
    return {"scraped": len(jobs)}

@app.get("/api/jobs")
def list_jobs(
    title: str | None = Query(None),
    employer: str | None = Query(None),
    area: str | None = Query(None),
    date_from: str | None = Query(None),  # YYYY-MM-DD
    date_to: str | None = Query(None),    # YYYY-MM-DD
    skill: str | None = Query(None),
):
    """
    Возвращает вакансии, отфильтрованные по:
      - title, employer, area  (строковые вхождения)
      - date_from, date_to     (диапазон дат)
      - skill                  (наличие в ключевых навыках)
    Каждый объект содержит:
      id, name, employer (строка), 
      area (строка), area_id (int),
      published_at, url,
      summary: [строк требований/обязанностей],
      key_skills: [строки навыков]
    """
    raw = load_jobs()
    out = []

    # парсим даты, если заданы
    df = datetime.fromisoformat(date_from).date() if date_from else None
    dt = datetime.fromisoformat(date_to).date() if date_to else None

    for it in raw:
        # area у нас уже строка
        city_name = it.get("area", "Unknown")
        pub_s = it.get("published_at", "")
        try:
            pub_d = datetime.fromisoformat(pub_s.replace("Z", "+00:00")).date()
        except:
            pub_d = None

        # фильтрация по дате
        if df and (not pub_d or pub_d < df): continue
        if dt and (not pub_d or pub_d > dt): continue

        # текстовые фильтры
        if title    and title.lower()   not in it.get("name", "").lower():     continue
        if employer and employer.lower() not in (it.get("employer") or "").lower(): continue
        if area     and area.lower()     not in city_name.lower():            continue

        # фильтр по навыку
        if skill:
            if skill not in it.get("key_skills", []):
                continue

        # всё подошло
        out.append({
            "id": it.get("id"),
            "name": it.get("name"),
            "employer": it.get("employer"),
            "area": city_name,
            "area_id": it.get("area_id"),
            "published_at": pub_s,
            "url": it.get("url") or it.get("alternate_url"),
            "summary": it.get("summary", []),
            "key_skills": it.get("key_skills", [])
        })

    return out

@app.get("/api/summary")
def summary(
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    employer: str | None = Query(None),
    area: str | None = Query(None),
    skill: str | None = Query(None),
):
    """
    Группирует вакансии (list_jobs) по строке города и возвращает для каждого города:
      city, count, lat, lon, skills (топ‑5 key_skills)
    Геокодирование города выполняется единожды.
    """
    jobs = list_jobs(None, employer, area, date_from, date_to, skill)

    groups: dict[str, list[dict]] = {}
    for job in jobs:
        city = job["area"]
        groups.setdefault(city, []).append(job)

    results = []
    for city, lst in groups.items():
        cnt = len(lst)
        # считаем key_skills
        counter = Counter(
            ks for job in lst for ks in job.get("key_skills", [])
            if ks and ks.lower() not in STOPWORDS
        )
        top5 = [s for s,_ in counter.most_common(5)]

        # геокодинг по названию города
        try:
            loc = geolocator.geocode(f"{city}, Russia")
            if not loc: 
                continue
            lat, lon = loc.latitude, loc.longitude
        except:
            continue

        results.append({
            "city": city,
            "count": cnt,
            "lat": lat,
            "lon": lon,
            "skills": top5
        })

    return results

@app.get("/api/skills")
def get_skills():
    """
    Глобальный топ‑20 навыков из key_skills всех вакансий.
    """
    raw = load_jobs()
    counter = Counter(
        ks for it in raw for ks in it.get("key_skills", [])
        if ks and ks.lower() not in STOPWORDS
    )
    top20 = counter.most_common(20)
    return [{"skill": w, "count": c} for w, c in top20]
