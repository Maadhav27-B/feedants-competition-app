const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validateObjectId } = require('../validators/competitionValidator');

router.get('/', optionalAuth, competitionController.getCompetitions);

router.get('/:id', validateObjectId('id'), optionalAuth, competitionController.getCompetitionById);

router.post('/:id/register', validateObjectId('id'), protect, competitionController.registerForCompetition);

router.post('/:id/unregister', validateObjectId('id'), protect, competitionController.unregisterFromCompetition);

router.get('/:id/participants', validateObjectId('id'), competitionController.getParticipants);

module.exports = router;
