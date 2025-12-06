import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/games.js';
import scoreRoutes from './routes/scores.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://gamezone-hackhawks.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);
app.use('/scores', scoreRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Mini Games Platform API is running' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});