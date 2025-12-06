import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { scoresAPI, gamesAPI } from '../api/api';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [recentScores, setRecentScores] = useState([]);
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    averageScore: 0,
    bestScore: 0,
    rank: '-'
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [scoresRes, gamesRes] = await Promise.all([
        scoresAPI.getUserScores(),
        gamesAPI.getAll()
      ]);

      const userScores = scoresRes.data;
      setRecentScores(userScores.slice(0, 5));
      setGames(gamesRes.data);

      // Calculate stats
      if (userScores.length > 0) {
        const scores = userScores.map(s => s.score);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const best = Math.max(...scores);
        
        setStats({
          gamesPlayed: userScores.length,
          averageScore: Math.round(avg),
          bestScore: best,
          rank: userScores[0]?.rank || '-'
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameTypeColor = (type) => {
    const colors = {
      speed: '#FF6B35',
      logic: '#8B5CF6',
      puzzle: '#10B981',
      memory: '#F59E0B',
      reflex: '#EF4444'
    };
    return colors[type] || '#6366F1';
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <span className="logo-icon">🎮</span>
            {sidebarOpen && <span className="logo-text">GameZone</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span className="nav-text">Dashboard</span>}
          </Link>
          <Link to="/games" className="nav-item">
            <span className="nav-icon">🎯</span>
            {sidebarOpen && <span className="nav-text">Games</span>}
          </Link>
          <Link to="/leaderboard" className="nav-item">
            <span className="nav-icon">🏆</span>
            {sidebarOpen && <span className="nav-text">Leaderboard</span>}
          </Link>
          <Link to="/my-scores" className="nav-item">
            <span className="nav-icon">📈</span>
            {sidebarOpen && <span className="nav-text">My Scores</span>}
          </Link>
        </nav>

        {sidebarOpen && (
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user.username}</div>
              <div className="user-points">{user.totalPoints} pts</div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Welcome back, {user.username}! 🎮</h1>
            <p className="header-subtitle">Here's your gaming performance overview</p>
          </div>
          <div className="header-actions">
            <Link to="/games" className="btn-play-now">
              Play Now
            </Link>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Games Played</div>
              <div className="stat-value">{stats.gamesPlayed}</div>
              <div className="stat-trend positive">+12% this week</div>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-label">Total Points</div>
              <div className="stat-value">{user.totalPoints}</div>
              <div className="stat-trend positive">+{stats.bestScore} best</div>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Average Score</div>
              <div className="stat-value">{stats.averageScore}</div>
              <div className="stat-trend neutral">Per game</div>
            </div>
          </div>

          <div className="stat-card stat-card-purple">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-label">Global Rank</div>
              <div className="stat-value">#{stats.rank}</div>
              <div className="stat-trend positive">Top player</div>
            </div>
          </div>
        </div>

        {/* Charts and Content Grid */}
        <div className="content-grid">
          {/* Performance Chart */}
          <div className="chart-card">
            <div className="card-header">
              <h3>Performance Overview</h3>
              <select className="chart-filter">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>All time</option>
              </select>
            </div>
            <div className="chart-container">
              <div className="bar-chart">
                <div className="chart-bar" style={{height: '70%'}}>
                  <span className="bar-value">280</span>
                </div>
                <div className="chart-bar" style={{height: '85%'}}>
                  <span className="bar-value">340</span>
                </div>
                <div className="chart-bar" style={{height: '60%'}}>
                  <span className="bar-value">240</span>
                </div>
                <div className="chart-bar" style={{height: '95%'}}>
                  <span className="bar-value">380</span>
                </div>
                <div className="chart-bar" style={{height: '75%'}}>
                  <span className="bar-value">300</span>
                </div>
                <div className="chart-bar" style={{height: '88%'}}>
                  <span className="bar-value">352</span>
                </div>
                <div className="chart-bar" style={{height: '92%'}}>
                  <span className="bar-value">368</span>
                </div>
              </div>
              <div className="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <Link to="/my-scores" className="view-all-link">View All →</Link>
            </div>
            <div className="activity-list">
              {recentScores.length > 0 ? (
                recentScores.map((score, index) => (
                  <div key={score._id} className="activity-item">
                    <div className="activity-icon" style={{
                      background: `linear-gradient(135deg, ${getGameTypeColor(score.gameId?.type)}, ${getGameTypeColor(score.gameId?.type)}dd)`
                    }}>
                      {index + 1}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{score.gameId?.name || 'Game'}</div>
                      <div className="activity-time">{new Date(score.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="activity-score">{score.score} pts</div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">🎮</span>
                  <p>No games played yet. Start playing!</p>
                </div>
              )}
            </div>
          </div>

          {/* Game Categories */}
          <div className="categories-card">
            <div className="card-header">
              <h3>Game Categories</h3>
            </div>
            <div className="categories-grid">
              <div className="category-item" style={{borderColor: '#FF6B35'}}>
                <div className="category-icon">⚡</div>
                <div className="category-name">Speed</div>
                <div className="category-count">2 games</div>
              </div>
              <div className="category-item" style={{borderColor: '#8B5CF6'}}>
                <div className="category-icon">🧠</div>
                <div className="category-name">Logic</div>
                <div className="category-count">1 game</div>
              </div>
              <div className="category-item" style={{borderColor: '#10B981'}}>
                <div className="category-icon">🧩</div>
                <div className="category-name">Puzzle</div>
                <div className="category-count">1 game</div>
              </div>
              <div className="category-item" style={{borderColor: '#EF4444'}}>
                <div className="category-icon">⚡</div>
                <div className="category-name">Reflex</div>
                <div className="category-count">1 game</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions-list">
              <Link to="/games" className="action-button action-primary">
                <span className="action-icon">🎮</span>
                <span className="action-text">Play Games</span>
              </Link>
              <Link to="/leaderboard" className="action-button action-success">
                <span className="action-icon">🏆</span>
                <span className="action-text">View Leaderboard</span>
              </Link>
              <Link to="/my-scores" className="action-button action-purple">
                <span className="action-icon">📊</span>
                <span className="action-text">My Statistics</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
