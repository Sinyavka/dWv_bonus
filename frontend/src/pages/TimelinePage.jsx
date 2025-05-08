import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import D3LineChart from '../components/D3LineChart';
import { fetchJobs } from '../api';

export default function TimelinePage() {
  const [filters, setFilters] = useState({
    date_from: '', date_to: '', employer: '', skill: ''
  });
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/skills')
      .then(r => r.json())
      .then(setSkillsOptions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchJobs(filters)
      .then(jobs => {
        const counts = {};
        jobs.forEach(j => {
          const date = j.published_at.split('T')[0];
          counts[date] = (counts[date] || 0) + 1;
        });
        const arr = Object.entries(counts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setData(arr);
      })
      .catch(console.error);
  }, [filters]);

  return (
    <div style={{ padding: '24px' }}>
      <FilterBar
        filters={filters}
        onChange={setFilters}
        skillsOptions={skillsOptions}
      />
      <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>
        Вакансии во времени
      </h2>
      <D3LineChart data={data} dateKey="date" valueKey="count" color="#ff69b4" />
    </div>
  );
}
