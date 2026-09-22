const competitionService = require('../services/competitionService');

const getCompetitions = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const competitions = await competitionService.getAllCompetitions(userId);
    return res.status(200).json({
      success: true,
      message: 'Competitions retrieved successfully',
      data: competitions
    });
  } catch (error) {
    next(error);
  }
};

const getCompetitionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;
    const competition = await competitionService.getCompetitionById(id, userId);
    return res.status(200).json({
      success: true,
      message: 'Competition loaded successfully',
      data: competition
    });
  } catch (error) {
    next(error);
  }
};

const registerForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const result = await competitionService.registerUserForCompetition(id, userId);
    return res.status(200).json({
      success: true,
      message: 'Successfully registered for competition',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const unregisterFromCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const result = await competitionService.unregisterUserFromCompetition(id, userId);
    return res.status(200).json({
      success: true,
      message: 'Successfully unregistered from competition',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getParticipants = async (req, res, next) => {
  try {
    const { id } = req.params;
    const participants = await competitionService.getCompetitionParticipants(id);
    return res.status(200).json({
      success: true,
      message: 'Participants loaded successfully',
      data: participants
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompetitions,
  getCompetitionById,
  registerForCompetition,
  unregisterFromCompetition,
  getParticipants
};
