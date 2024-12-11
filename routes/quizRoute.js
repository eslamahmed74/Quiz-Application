const quizController = require("../controllers/quizController");
const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .all(authController.protect)
  .get(authController.restricTo("user", "admin"), quizController.getAllQuizzes)
  .post(authController.restricTo("admin"), quizController.createQuiz);

router
  .route("/:id")
  .all(authController.protect)
  .get(authController.restricTo("user", "admin"), quizController.getQuizById)
  .put(authController.restricTo("admin"), quizController.updateQuiz)
  .delete(authController.restricTo("admin"), quizController.deleteQuiz);

module.exports = router;
