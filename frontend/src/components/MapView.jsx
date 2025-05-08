import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapView() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/summary`)
      .then(res => res.json())
      .then(setData);
  }, []);
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      <h2>Interactive Map</h2>
      <MapContainer center={[55.75, 37.62]} zoom={4} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data.map(c => (
          <CircleMarker
            key={c.city}
            center={[c.lat, c.lon]}
            radius={5 + (c.count / max) * 20}
            fillOpacity={0.6}
          >
            <Popup>
              <b>{c.city}</b>: {c.count} вакансий<br/>
              <a href={`https://hh.ru/search/vacancy?area=${c.area_id}`} target="_blank" rel="noreferrer">View listings</a>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
