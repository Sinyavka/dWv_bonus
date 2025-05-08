import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompaniesPage from './pages/CompaniesPage';
import LocationsPage from './pages/LocationsPage';
import TimelinePage from './pages/TimelinePage';
import MapPage from './pages/MapPage';
import SkillsPage from './pages/SkillsPage';
import './App.css';

export default function App() {
  return (
    <>
      <nav className="kitty-nav">
        <Link to="/" className="kitty-link">Home</Link>
        <Link to="/companies" className="kitty-link">Companies</Link>
        <Link to="/locations" className="kitty-link">Locations</Link>
        <Link to="/timeline" className="kitty-link">Timeline</Link>
        <Link to="/map" className="kitty-link">Map</Link>
        <Link to="/skills" className="kitty-link">Skills</Link>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/skills" element={<SkillsPage />} />
        </Routes>
      </main>
    </>
  );
}
