import React from 'react';

/**
 * Универсальная панель фильтров.
 * Принимает:
 * - filters: { date_from, date_to, employer, skill }
 * - onChange: колбэк (новыеFilters) => void
 * - skillsOptions: массив { skill, count } для селекта
 */
export default function FilterBar({ filters, onChange, skillsOptions }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '24px',
      alignItems: 'center'
    }}>
      <label>
        С даты 
        <input
          type="date"
          name="date_from"
          value={filters.date_from}
          onChange={handleChange}
        />
      </label>
      <label>
        По дату 
        <input
          type="date"
          name="date_to"
          value={filters.date_to}
          onChange={handleChange}
        />
      </label>
      <label>
        Компания 
        <input
          type="text"
          name="employer"
          placeholder="имя компании"
          value={filters.employer}
          onChange={handleChange}
        />
      </label>
      <label>
        Навык 
        <select
          name="skill"
          value={filters.skill}
          onChange={handleChange}
        >
          <option value="">Все навыки</option>
          {skillsOptions.map(({ skill }) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
