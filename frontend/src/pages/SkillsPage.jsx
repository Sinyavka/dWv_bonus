import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import D3BarChart from '../components/D3BarChart';

export default function SkillsPage() {
  const [filters, setFilters] = useState({
    date_from: '', date_to: '', employer: '', skill: ''
  });
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [data, setData] = useState([]);

  // Для селекта используем тот же список навыков
  useEffect(() => {
    fetch('http://localhost:8000/api/skills')
      .then(r => r.json())
      .then(setSkillsOptions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const qs = new URLSearchParams(filters).toString();
    fetch(`http://localhost:8000/api/skills?${qs}`)
      .then(r => r.json())
      .then(setData)
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
        Топ-20 актуальных скилов
      </h2>
      <D3BarChart data={data} labelKey="skill" valueKey="count" color="#ff69b4" />
    </div>
  );
}
