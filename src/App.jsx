import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { getUser } from './lib/store';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(() => getUser());

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Routes>
          <Route 
            path="/onboarding" 
            element={!user ? <Onboarding onComplete={(u) => setUser(u)} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/onboarding" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
