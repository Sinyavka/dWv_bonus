import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../api';

export default function HomePage() {
  const [stats, setStats] = useState({
    vacancies: 0,
    companies: 0,
    locations: 0
  });

  useEffect(() => {
    fetchJobs({})
      .then(jobs => {
        const vacs = jobs.length;
        const comps = new Set(jobs.map(j => j.employer)).size;
        const locs  = new Set(jobs.map(j => j.area)).size;
        setStats({ vacancies: vacs, companies: comps, locations: locs });
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Job Dashboard</h1>
      <p style={{ fontSize: '1.5rem', margin: '0.5rem' }}>
        Всего вакансий: <strong>{stats.vacancies}</strong>
      </p>
      <p style={{ fontSize: '1.5rem', margin: '0.5rem' }}>
        Всего компаний: <strong>{stats.companies}</strong>
      </p>
      <p style={{ fontSize: '1.5rem', margin: '0.5rem' }}>
        Всего локаций: <strong>{stats.locations}</strong>
      </p>
    </div>
  );
}
