import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

function Charts({ jobs }) {
  const compCounts = {};
  const locCounts = {};
  const timeCounts = {};

  jobs.forEach(job => {
    compCounts[job.employer] = (compCounts[job.employer] || 0) + 1;
    locCounts[job.area] = (locCounts[job.area] || 0) + 1;
    const date = job.published_at.split('T')[0];
    timeCounts[date] = (timeCounts[date] || 0) + 1;
  });

  const compData = Object.entries(compCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  const locData = Object.entries(locCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  const timeData = Object.entries(timeCounts).map(([date, count]) => ({ date, count })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <h2>Top Companies</h2>
      <BarChart width={600} height={300} data={compData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count" /></BarChart>
      <h2>Top Locations</h2>
      <BarChart width={600} height={300} data={locData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count" /></BarChart>
      <h2>Vacancies Over Time</h2>
      <LineChart width={600} height={300} data={timeData}><XAxis dataKey="date" /><YAxis /><Tooltip /><CartesianGrid stroke="#ccc"/><Line type="monotone" dataKey="count" /></LineChart>
    </div>
  );
}

export default Charts;
