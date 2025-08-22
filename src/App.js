import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';  
import TrainersDashboard from './components/TrainersDashboard';  
import MembersDashboard from './components/Membersdashboard';
import AdminsDashboard from './components/AdminsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* HomePage is rendered when the user is on the root route */}
        <Route path="" element={<HomePage />} />
        
        {/* TrainersDashboard is rendered when the user is on the /dashboard route */}
        <Route path="/trainer" element={<TrainersDashboard />} />

        <Route path="/member" element={<MembersDashboard />} />
        {/* HomePage is rendered when the user is on the root route */}
        <Route path="/admin" element={<AdminsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
