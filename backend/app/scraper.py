import requests
import time
import json
import os
import re

def clean_html(raw: str) -> str:
    """Убирает HTML-теги и нормализует пробелы."""
    clean = re.sub(r'<[^>]+>', '', raw)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def scrape_jobs(pages: int = 10, per_page: int = 100):
    """
    Скачивает вакансии со страницы, затем для каждой идёт в detail
    и забирает реальные key_skills.
    Сохраняет summary (requirement+responsibility) и key_skills.
    """
    all_jobs = []
    for page in range(pages):
        resp = requests.get(
            "https://api.hh.ru/vacancies",
            params={"page": page, "per_page": per_page}
        )
        resp.raise_for_status()
        items = resp.json().get("items", [])
        for item in items:
            # базовые поля из списка
            rec = {
                "id": item.get("id"),
                "name": item.get("name"),
                "employer": item.get("employer", {}).get("name"),
                "area": item.get("area", {}).get("name"),
                "area_id": item.get("area", {}).get("id"),
                "published_at": item.get("published_at"),
                "url": item.get("alternate_url"),
            }
            # snippet → summary
            summary = []
            req = item.get("snippet", {}).get("requirement")
            if req:
                summary.append(clean_html(req))
            resp_snip = item.get("snippet", {}).get("responsibility")
            if resp_snip:
                summary.append(clean_html(resp_snip))
            rec["summary"] = summary

            # detail → key_skills
            detail = requests.get(f"https://api.hh.ru/vacancies/{rec['id']}").json()
            rec["key_skills"] = [ks.get("name") for ks in detail.get("key_skills", [])]

            all_jobs.append(rec)

        print(f"Page {page+1}/{pages}: fetched {len(items)} items (total {len(all_jobs)})")
        time.sleep(0.2)

    return all_jobs

if __name__ == "__main__":
    base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    os.makedirs(base, exist_ok=True)
    jobs = scrape_jobs()
    path = os.path.join(base, "jobs.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(jobs)} jobs to {path}")
