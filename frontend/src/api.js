const API_URL = "http://localhost:8000";

export async function fetchJobs(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/jobs?${query}`);
  if (!res.ok) throw new Error(`Error fetching jobs: ${res.status}`);
  return res.json();
}

export async function triggerScrape() {
  const res = await fetch(`${API_URL}/api/scrape`, { method: 'POST' });
  if (!res.ok) throw new Error(`Error triggering scrape: ${res.status}`);
  return res.json();
}
