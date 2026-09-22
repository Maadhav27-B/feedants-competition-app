const mongoose = require('mongoose');
const { COMPETITION_STATUS } = require('../constants/status');

const rewardSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true },
    rankText: { type: String, required: true },
    prizeAmount: { type: Number, required: true }
  },
  { _id: false }
);

const previousWinnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rankText: { type: String, required: true },
    image: { type: String, required: true },
    videoUrl: { type: String }
  },
  { _id: false }
);

const judgingParameterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800'
    },
    category: {
      type: String,
      required: true,
      default: 'Dance'
    },
    tags: [
      {
        type: String
      }
    ],
    organizer: {
      name: { type: String, default: 'Manju Dubey' },
      role: { type: String, default: 'Judge' },
      title: { type: String, default: 'Professional Kathak Dancer' },
      experience: { type: String, default: '12+ Years of Experience' },
      image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
      },
      introVideoUrl: { type: String }
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0,
      default: 99
    },
    prizePool: {
      type: Number,
      required: true,
      min: 0,
      default: 1500
    },
    maximumParticipants: {
      type: Number,
      required: true,
      min: 1,
      default: 20
    },
    currentParticipants: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    registrationStartDate: {
      type: Date,
      required: true
    },
    registrationEndDate: {
      type: Date,
      required: true
    },
    submissionStartDate: {
      type: Date
    },
    submissionEndDate: {
      type: Date
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    resultDate: {
      type: Date
    },
    status: {
      type: String,
      enum: Object.values(COMPETITION_STATUS),
      default: COMPETITION_STATUS.REGISTRATION_OPEN
    },
    rules: [
      {
        type: String
      }
    ],
    eligibility: [
      {
        type: String
      }
    ],
    judgingParameters: [judgingParameterSchema],
    rewards: [rewardSchema],
    previousWinners: [previousWinnerSchema],
    disclaimer: {
      type: String,
      default: 'Only contributions from paid participants will be considered for judging.'
    },
    referralLink: {
      type: String,
      default: 'https://feedants.com/r/referral123'
    },
    referralBonusAmount: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true
  }
);

// Database Indexes for optimized querying
competitionSchema.index({ status: 1 });
competitionSchema.index({ startDate: 1 });
competitionSchema.index({ registrationStartDate: 1 });
competitionSchema.index({ registrationEndDate: 1 });

/**
 * Derives the dynamic lifecycle status based on current date & capacity.
 * Prevents relying purely on stale manually saved status fields in DB.
 */
competitionSchema.methods.calculateDynamicStatus = function (nowDate = new Date()) {
  if (this.status === COMPETITION_STATUS.CANCELLED) {
    return COMPETITION_STATUS.CANCELLED;
  }

  const now = new Date(nowDate).getTime();
  const regStart = new Date(this.registrationStartDate).getTime();
  const regEnd = new Date(this.registrationEndDate).getTime();
  const start = new Date(this.startDate).getTime();
  const end = new Date(this.endDate).getTime();

  if (now < regStart) {
    return COMPETITION_STATUS.UPCOMING;
  }

  if (now >= regStart && now <= regEnd) {
    if (this.currentParticipants >= this.maximumParticipants) {
      return COMPETITION_STATUS.FULL;
    }
    return COMPETITION_STATUS.REGISTRATION_OPEN;
  }

  if (now > regEnd && now <= end) {
    return COMPETITION_STATUS.LIVE;
  }

  if (now > end) {
    return COMPETITION_STATUS.COMPLETED;
  }

  return this.status;
};

module.exports = mongoose.model('Competition', competitionSchema);
