# Job Dashboard Setup Instructions

# Frontend & Backend Setup in one code block.

## 1. Backend Setup
 Prereqs: Python 3.10+, pip, virtualenv

### Navigate to backend folder
cd dWv_bonus/backend

### Create & activate virtual environment
python3 -m venv venv
#### macOS/Linux:
source venv/bin/activate
#### Windows (PowerShell):
 venv\Scripts\Activate.ps1

### Install Python dependencies
pip install fastapi uvicorn requests geopy

### Scrape vacancy data (populate data/jobs.json):
 Option A: HTTP endpoint (after server runs)
####   curl -X POST http://localhost:8000/api/scrape
 Option B: direct script
python app/scraper.py

### Launch FastAPI server
uvicorn app.main:app --reload --port 8000


## API base URL: http://127.0.0.1:8000

## 2. Frontend Setup
Prereqs: Node.js 16+, npm

### In a new terminal, navigate to frontend folder
cd dWv_bonus/frontend

### Install Node dependencies
npm install

### Start React development server
npm start
#### UI available at http://localhost:3000

## 3. Access the Dashboard

### - Frontend: http://localhost:3000
### - Backend API: http://localhost:8000

# Pages & Endpoints:
 Home      → GET /api/jobs (shows totals)
 Companies → GET /api/jobs? (top companies)
 Locations → GET /api/summary (city map)
 Timeline  → GET /api/jobs (over time)
 Map       → GET /api/summary (static map)
 Skills    → GET /api/skills (top-20 skills)

# 4. Troubleshooting

- If empty graphs → re-run scraper (see step 1).
- Check browser console & network tab for errors.
- CORS is set to allow all origins on the backend.
- Change ports if needed:
     FRONTEND: PORT=3001 npm start
     BACKEND:  uvicorn app.main:app --reload --port 8001
