import express from 'express';
import Score from '../models/Score.js';
import User from '../models/User.js';
import Game from '../models/Game.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Submit score (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { gameId, score } = req.body;

    // Validate game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Create score record
    const newScore = new Score({
      userId: req.userId,
      gameId,
      score
    });
    await newScore.save();

    // Update user's total points
    await User.findByIdAndUpdate(req.userId, {
      $inc: { totalPoints: score }
    });

    // Increase game popularity
    await Game.findByIdAndUpdate(gameId, {
      $inc: { popularity: 1 }
    });

    res.status(201).json({
      message: 'Score submitted successfully',
      score: newScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get global leaderboard
router.get('/leaderboard/global', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    const leaderboard = await User.find()
      .sort({ totalPoints: -1 })
      .limit(limit)
      .select('username totalPoints createdAt');

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get per-game leaderboard
router.get('/game/:gameId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    const leaderboard = await Score.find({ gameId: req.params.gameId })
      .sort({ score: -1 })
      .limit(limit)
      .populate('userId', 'username')
      .populate('gameId', 'name');

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's scores
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('gameId', 'name difficulty type');

    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
