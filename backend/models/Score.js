import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster leaderboard queries
scoreSchema.index({ gameId: 1, score: -1 });
scoreSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Score', scoreSchema);
