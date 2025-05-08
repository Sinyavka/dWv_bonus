import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import D3BarChart from '../components/D3BarChart';
import { fetchJobs } from '../api';

export default function LocationsPage() {
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
          const loc = j.area || 'Unknown';
          counts[loc] = (counts[loc] || 0) + 1;
        });
        const arr = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
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
        Топ локаций по количеству вакансий
      </h2>
      <D3BarChart data={data} labelKey="name" valueKey="count" color="#ff69b4" />
    </div>
  );
}
