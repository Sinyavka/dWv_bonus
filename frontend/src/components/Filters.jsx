import React from 'react';

function Filters({ filters, onChange }) {
  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value });
  return (
    <div style={{ margin: '10px 0' }}>
      <input name="title" value={filters.title} placeholder="Job Title" onChange={handle} style={{ marginRight: '5px' }} />
      <input name="employer" value={filters.employer} placeholder="Company" onChange={handle} style={{ marginRight: '5px' }} />
      <input name="area" value={filters.area} placeholder="Location" onChange={handle} />
    </div>
  );
}

export default Filters;
