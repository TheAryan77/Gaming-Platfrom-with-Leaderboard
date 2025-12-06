import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://gaming-platfrom-with-leaderboard.onrender.com'
  : 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Games API
export const gamesAPI = {
  getAll: (params) => api.get('/games', { params }),
  getById: (id) => api.get(`/games/${id}`),
  create: (data) => api.post('/games', data),
  update: (id, data) => api.put(`/games/${id}`, data),
  delete: (id) => api.delete(`/games/${id}`)
};

// Scores API
export const scoresAPI = {
  submit: (data) => api.post('/scores', data),
  getUserScores: () => api.get('/scores/user'),
  getGameLeaderboard: (gameId, limit) => 
    api.get(`/scores/game/${gameId}`, { params: { limit } }),
  getGlobalLeaderboard: (limit) => 
    api.get('/scores/leaderboard/global', { params: { limit } })
};

export default api;
