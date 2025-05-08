import React from 'react';

function JobsTable({ jobs }) {
  return (
    <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', margin: '10px 0' }}>
      <thead>
        <tr>
          <th>Title</th><th>Company</th><th>Location</th><th>Published</th><th>Link</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr key={job.id}>
            <td>{job.name}</td>
            <td>{job.employer}</td>
            <td>{job.area}</td>
            <td>{new Date(job.published_at).toLocaleString()}</td>
            <td><a href={job.url} target="_blank" rel="noreferrer">View</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default JobsTable;
