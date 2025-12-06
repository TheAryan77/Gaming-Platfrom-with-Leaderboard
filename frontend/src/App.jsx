import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import GamePlay from './pages/GamePlay';
import Leaderboard from './pages/Leaderboard';
import GameLeaderboard from './pages/GameLeaderboard';
import './App.css';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  // Hide navbar on dashboard, games, gameplay, and leaderboard pages
  const hideNavbar = ['/dashboard', '/games', '/leaderboard'].some(path => 
    location.pathname.startsWith(path)
  ) || location.pathname.startsWith('/game/');

  return (
    <div className="app">
      {user && !hideNavbar && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <Games />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game/:id"
                element={
                  <ProtectedRoute>
                    <GamePlay />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard/game/:gameId"
                element={
                  <ProtectedRoute>
                    <GameLeaderboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
