const mongoose = require('mongoose');
const { PARTICIPATION_STATUS } = require('../constants/status');

const participationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PARTICIPATION_STATUS),
      default: PARTICIPATION_STATUS.REGISTERED
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Crucial: Compound unique index enforcing single registration per user per competition
participationSchema.index({ userId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Participation', participationSchema);
