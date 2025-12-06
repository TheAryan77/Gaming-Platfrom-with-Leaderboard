import express from 'express';
import Game from '../models/Game.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all games with optional filters
router.get('/', async (req, res) => {
  try {
    const { difficulty, type, sort } = req.query;
    const filter = {};
    
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    let sortOption = {};
    if (sort === 'popularity') {
      sortOption = { popularity: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { name: 1 };
    }

    const games = await Game.find(filter).sort(sortOption);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new game (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, difficulty, type } = req.body;

    const game = new Game({
      name,
      description,
      difficulty,
      type
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Game with this name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update game (protected route)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, difficulty, type } = req.body;

    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { name, description, difficulty, type },
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete game (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
