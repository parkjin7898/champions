import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChampionList from './components/ChampionList';
import ChampionDetail from './components/ChampionDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Routes>
        <Route path="/" element={<ChampionList />} />
        <Route path="/:englishName" element={<ChampionDetail />} />
      </Routes>
    </div>
  );
}

export default App;
