const { where } = require("sequelize");
const { UserProgress } = require("../models/modelsCreator");
const { Quiz } = require("../models/modelsCreator");
const { Question } = require("../models/modelsCreator");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.startQuiz = catchAsync(async (req, res, next) => {
  const { quizId } = req.body;
  const quiz = await Quiz.findByPk(quizId, {
    include: [{ model: Question, as: "questions" }],
  });

  if (!quiz) return next(new AppError("this quiz not found ", 404));

  let progress = await UserProgress.findOne({
    where: {
      user_id: req.user.id,
      quiz_id: quizId,
    },
  });

  if (!progress) {
    progress = await UserProgress.create({
      user_id: req.user.id,
      quiz_id: quizId,
    });
  }

  const firstQuestion = quiz.questions[0];
  if (!firstQuestion) {
    return next(new AppError("there is no questions found for this quiz", 404));
  }

  res.status(200).json({
    status: "success",
    data: { progress, question: firstQuestion },
  });
});

exports.answerQuestion = catchAsync(async (req, res, next) => {
  const { quizId, answer } = req.body;

  const progress = await UserProgress.findOne({
    where: {
      user_id: req.user.id,
      quiz_id: quizId,
    },
  });

  if (!progress) {
    return next(new AppError("no progress found for this quiz", 404));
  }

  const questions = await Question.findAll({
    where: { quiz_id: quizId },
  });

  if (!currentQuestion) {
    return res.status(200).json({
      status: "success",
      message: "Quiz completed!",
      finalScore: progress.score,
    });
  }

  let message;
  if (currentQuestion.correct_answer === answer) {
    progress.score += 1;
    message = "Correct answer!";
  } else {
    message = "Incorrect answer.";
  }

  // Move to next question
  progress.current_question_index += 1;
  await progress.save();

  const nextQuestion = questions[progress.current_question_index] || null;

  res.status(200).json({
    status: "success",
    message,
    nextQuestion: nextQuestion
      ? {
          id: nextQuestion.id,
          question_text: nextQuestion.question_text,
          options: JSON.parse(nextQuestion.options),
        }
      : null,
  });
});

exports.submitQuiz = catchAsync(async (req, res, next) => {
  const { quizId } = req.body;
  const progress = await UserProgress.findOne({
    where: {
      user_id: req.user.id,
      quiz_id: quizId,
    },
  });

  if (!progress) {
    return next(new AppError("Couldn't find a progress for this user ", 404));
  }

  progress.completed_at = new Date();
  await progress.save();

  res.status(200).json({
    status: "success",
    data: {
      progress,
    },
  });
});

exports.getUserProgress = catchAsync(async (req, res, next) => {
  const progress = await UserProgress.findAll({
    where: {
      user_id: req.user.id,
    },
    include: { model: Quiz },
  });

  res.status(200).json({
    status: "success",
    result: progress.length,
    data: { progress },
  });
});
