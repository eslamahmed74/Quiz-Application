const express = require("express");
const authController = require("../controllers/authController");
const questionController = require("../controllers/questionController");

const router = express.Router();

router
  .route("/")
  .all(authController.protect)
  .get(questionController.getQuizQuestions)
  .post(authController.restricTo("admin"), questionController.createQuestion);

router
  .route("/:id")
  .all(authController.protect)
  .get(questionController.getQuestionById)
  .all(authController.restricTo("admin"))
  .put(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
