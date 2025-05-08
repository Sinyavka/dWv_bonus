import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapPage() {
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
    const qs = new URLSearchParams(filters).toString();
    fetch(`http://localhost:8000/api/summary?${qs}`)
      .then(r => r.json())
      .then(arr => setData(Array.isArray(arr) ? arr : []))
      .catch(console.error);
  }, [filters]);

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div style={{ padding: 24 }}>
      <FilterBar
        filters={filters}
        onChange={setFilters}
        skillsOptions={skillsOptions}
      />
      <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>
        Карта вакансий и реальных навыков по городам
      </h2>
      <MapContainer
        center={[55.75, 37.62]}
        zoom={4}
        style={{ height: '500px', width: '100%' }}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        zoomControl={false}
        touchZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data.map(c => (
          <CircleMarker
            key={c.city}
            center={[c.lat, c.lon]}
            radius={5 + (c.count / max) * 20}
            pathOptions={{ color: '#ff69b4' }}
            fillOpacity={0.6}
          >
            <Popup>
              <div style={{ minWidth: 150 }}>
                <strong>{c.city}</strong><br/>
                Вакансий: {c.count}<br/>
                <em>Топ-навкилы:</em>
                <ul style={{ paddingLeft: '1em', margin: '4px 0' }}>
                  {c.skills.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
