const catchAsync = require("../utils/catchAsync");
const { Question } = require("../models/modelsCreator");
const AppError = require("../utils/appError");
const { Quiz } = require("../models/modelsCreator");

const checkIsQuizExist = async (id) => {
  const quiz = await Quiz.findByPk(id);

  if (!quiz) return false;

  return true;
};

// create question
exports.createQuestion = catchAsync(async (req, res, next) => {
  const { quizId, questionText, options, correctAnswer } = req.body;

  if (!quizId || !correctAnswer || !options || !questionText) {
    return next(new AppError("all fields are required", 400));
  }

  const isQuizExist = await checkIsQuizExist(quizId);

  if (!isQuizExist) {
    return next(
      new AppError(
        `there is no quiz for this id ${quizId} please enter a vaild id `,
        400
      )
    );
  }
  const question = await Question.create({
    quiz_id: quizId,
    question_text: questionText,
    options,
    correct_answer: correctAnswer,
  });

  res.status(201).json({
    status: "success",
    data: {
      question,
    },
  });
});

//get question by quiz
exports.getQuizQuestions = catchAsync(async (req, res, next) => {
  const { quizId } = req.query;
  if (!quizId) {
    res.status(200).send("provide a quiz id to see it's questions");
  }

  const isQuizExist = await checkIsQuizExist(quizId);

  if (!isQuizExist) {
    return next(
      new AppError(
        `there is no quiz for this id ${quizId} please enter a vaild id `,
        400
      )
    );
  }

  const questions = await Question.findAll({ where: { quiz_id: quizId } });
  res.status(200).json({
    status: "success",
    result: questions.length,
    data: {
      questions,
    },
  });
});

//get question by id
exports.getQuestionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const question = await Question.findByPk(id);

  if (!question) {
    return next(new AppError(`there is no question with id: ${id}`), 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

// update question
exports.updateQuestion = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { questionText, options, correctAnswer } = req.body;

  const question = await Question.findByPk(id);

  if (!question) {
    return next(new AppError("Question not found", 404));
  }

  question.question_text = questionText || question.question_text;
  question.options = options || question.options;
  question.correct_answer = correctAnswer || question.correct_answer;
  await question.save();

  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

// delete question
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const question = await Question.findByPk(id);

  if (!question) {
    return next(new AppError("Question not found", 404));
  }

  await question.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
