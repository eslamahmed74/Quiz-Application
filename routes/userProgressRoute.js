const express = require('express');
const progressController = require('../controllers/userProgressController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/start', progressController.startQuiz); // Start quiz and fetch first question
router.post('/answer', progressController.answerQuestion); // Answer current question
router.post('/submit',progressController.submitQuiz)
router.get('/my-progress', progressController.getUserProgress); // Get user progress

module.exports = router;
