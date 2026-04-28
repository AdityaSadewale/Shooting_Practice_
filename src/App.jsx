import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from './lib/store';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setLoading(false);
  }, []);

  if (loading) return null;

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
