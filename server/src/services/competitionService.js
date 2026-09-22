const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Participation = require('../models/Participation');
const { COMPETITION_STATUS, PARTICIPATION_STATUS } = require('../constants/status');

/**
 * Formats competition response with calculated lifecycle state & user participation
 */
const formatCompetitionResponse = (competitionDoc, participationDoc = null) => {
  const comp = competitionDoc.toObject ? competitionDoc.toObject() : competitionDoc;
  const derivedStatus = competitionDoc.calculateDynamicStatus
    ? competitionDoc.calculateDynamicStatus()
    : comp.status;

  const remainingSpots = Math.max(0, comp.maximumParticipants - comp.currentParticipants);

  return {
    ...comp,
    status: derivedStatus,
    remainingSpots,
    isFull: comp.currentParticipants >= comp.maximumParticipants,
    userParticipation: participationDoc
      ? {
          isRegistered: participationDoc.status === PARTICIPATION_STATUS.REGISTERED,
          status: participationDoc.status,
          registeredAt: participationDoc.registeredAt
        }
      : {
          isRegistered: false,
          status: null,
          registeredAt: null
        }
  };
};

/**
 * Get all competitions with calculated status
 */
const getAllCompetitions = async (userId = null) => {
  const competitions = await Competition.find().sort({ registrationEndDate: 1 });

  let userParticipations = [];
  if (userId) {
    userParticipations = await Participation.find({ userId, status: PARTICIPATION_STATUS.REGISTERED });
  }

  const userParticipationMap = new Map();
  userParticipations.forEach((p) => {
    userParticipationMap.set(p.competitionId.toString(), p);
  });

  return competitions.map((comp) => {
    const p = userParticipationMap.get(comp._id.toString());
    return formatCompetitionResponse(comp, p);
  });
};

/**
 * Get competition by ID with calculated status and user participation details
 */
const getCompetitionById = async (competitionId, userId = null) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) {
    const error = new Error('Competition not found');
    error.statusCode = 404;
    error.code = 'COMPETITION_NOT_FOUND';
    throw error;
  }

  let participation = null;
  if (userId) {
    participation = await Participation.findOne({
      userId,
      competitionId,
      status: PARTICIPATION_STATUS.REGISTERED
    });
  }

  return formatCompetitionResponse(competition, participation);
};

/**
 * Atomic Registration Strategy
 * Handles high concurrency and prevents overbooking & duplicate registrations.
 */
const registerUserForCompetition = async (competitionId, userId) => {
  // 1. Fetch competition to inspect baseline rules & lifecycle
  const competition = await Competition.findById(competitionId);
  if (!competition) {
    const error = new Error('Competition not found');
    error.statusCode = 404;
    error.code = 'COMPETITION_NOT_FOUND';
    throw error;
  }

  // 2. Derive current real-time status
  const currentStatus = competition.calculateDynamicStatus();
  const now = new Date().getTime();
  const regStart = new Date(competition.registrationStartDate).getTime();
  const regEnd = new Date(competition.registrationEndDate).getTime();

  if (now < regStart) {
    const error = new Error('Registration for this competition has not started yet');
    error.statusCode = 400;
    error.code = 'REGISTRATION_NOT_STARTED';
    throw error;
  }

  if (now > regEnd || currentStatus === COMPETITION_STATUS.LIVE || currentStatus === COMPETITION_STATUS.COMPLETED) {
    const error = new Error('Registration window has closed for this competition');
    error.statusCode = 400;
    error.code = 'REGISTRATION_CLOSED';
    throw error;
  }

  if (currentStatus === COMPETITION_STATUS.CANCELLED) {
    const error = new Error('This competition has been cancelled');
    error.statusCode = 400;
    error.code = 'COMPETITION_CANCELLED';
    throw error;
  }

  // 3. Pre-check existing registration
  const existingParticipation = await Participation.findOne({
    userId,
    competitionId,
    status: PARTICIPATION_STATUS.REGISTERED
  });

  if (existingParticipation) {
    const error = new Error('You are already registered for this competition');
    error.statusCode = 400;
    error.code = 'ALREADY_REGISTERED';
    throw error;
  }

  // 4. Atomic Capacity Increment & Registration Entry
  // Uses MongoDB Session transaction if supported by DB deployment, otherwise safe atomic findOneAndUpdate fallback.
  let session = null;
  const supportsTransactions = mongoose.connection.client && mongoose.connection.client.topology && mongoose.connection.client.topology.hasSessionSupport ? true : false;

  try {
    if (supportsTransactions) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    // Atomic update with query condition ensuring currentParticipants < maximumParticipants
    const updatedCompetition = await Competition.findOneAndUpdate(
      {
        _id: competitionId,
        currentParticipants: { $lt: competition.maximumParticipants }
      },
      {
        $inc: { currentParticipants: 1 }
      },
      { new: true, session }
    );

    if (!updatedCompetition) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      const error = new Error('Registration failed. Competition capacity has been reached.');
      error.statusCode = 400;
      error.code = 'COMPETITION_FULL';
      throw error;
    }

    // Create Participation record (database unique compound index guarantees no duplicate insertion)
    let participation;
    try {
      if (session) {
        const created = await Participation.create(
          [
            {
              userId,
              competitionId,
              status: PARTICIPATION_STATUS.REGISTERED,
              registeredAt: new Date()
            }
          ],
          { session }
        );
        participation = created[0];
        await session.commitTransaction();
        session.endSession();
      } else {
        participation = await Participation.create({
          userId,
          competitionId,
          status: PARTICIPATION_STATUS.REGISTERED,
          registeredAt: new Date()
        });
      }
    } catch (createErr) {
      // Rollback participant count increment if unique compound index collision occurred
      if (createErr.code === 11000) {
        await Competition.findByIdAndUpdate(competitionId, { $inc: { currentParticipants: -1 } });
        if (session) {
          await session.abortTransaction();
          session.endSession();
        }
        const error = new Error('You are already registered for this competition');
        error.statusCode = 400;
        error.code = 'ALREADY_REGISTERED';
        throw error;
      }
      throw createErr;
    }

    return formatCompetitionResponse(updatedCompetition, participation);
  } catch (error) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

/**
 * Unregister user from competition
 */
const unregisterUserFromCompetition = async (competitionId, userId) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) {
    const error = new Error('Competition not found');
    error.statusCode = 404;
    error.code = 'COMPETITION_NOT_FOUND';
    throw error;
  }

  const now = new Date().getTime();
  const regEnd = new Date(competition.registrationEndDate).getTime();
  if (now > regEnd) {
    const error = new Error('Cannot cancel registration after registration deadline has passed');
    error.statusCode = 400;
    error.code = 'UNREGISTRATION_CLOSED';
    throw error;
  }

  const participation = await Participation.findOne({
    userId,
    competitionId,
    status: PARTICIPATION_STATUS.REGISTERED
  });

  if (!participation) {
    const error = new Error('You are not currently registered for this competition');
    error.statusCode = 400;
    error.code = 'NOT_REGISTERED';
    throw error;
  }

  // Update participation status
  participation.status = PARTICIPATION_STATUS.CANCELLED;
  await participation.save();

  // Decrement current participants atomically
  const updatedCompetition = await Competition.findByIdAndUpdate(
    competitionId,
    { $inc: { currentParticipants: -1 } },
    { new: true }
  );

  return formatCompetitionResponse(updatedCompetition, null);
};

/**
 * Get participant list for a competition
 */
const getCompetitionParticipants = async (competitionId) => {
  const participations = await Participation.find({
    competitionId,
    status: PARTICIPATION_STATUS.REGISTERED
  })
    .populate('userId', 'name email profileImage')
    .sort({ registeredAt: -1 });

  return participations.map((p) => ({
    id: p._id,
    user: p.userId,
    registeredAt: p.registeredAt
  }));
};

module.exports = {
  getAllCompetitions,
  getCompetitionById,
  registerUserForCompetition,
  unregisterUserFromCompetition,
  getCompetitionParticipants
};
