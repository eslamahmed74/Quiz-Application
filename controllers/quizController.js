const catchAsync = require("../utils/catchAsync");
const { Quiz } = require("../models/modelsCreator");
const AppError = require("../utils/appError");

//create quiz
exports.createQuiz = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return next(
      new AppError("please provide the title and the description", 400)
    );
  }

  const quiz = await Quiz.create({
    title,
    description,
    created_by: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: {
      quiz,
    },
  });
});
  
//get quizzes
exports.getAllQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.findAll();
  res.status(200).json({
    status: "success",
    result: quizzes.length,
    data: {
      quizzes,
    },
  });
});

// get quiz by id
exports.getQuizById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const quiz = await Quiz.findByPk(id);

  if (!quiz) {
    return next(new AppError(`there is no quiz with this id : ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      quiz,
    },
  });
});

//update quiz
exports.updateQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const quiz = await Quiz.findByPk(id);

  if (!quiz) {
    return next(new AppError(`there is no quiz with this id : ${id}`, 404));
  }

  quiz.title = title || quiz.title;
  quiz.description = description || quiz.description;
  await quiz.save();

  res.status(200).json({
    status: "success",
    quiz,
  });
});

// delete quiz
exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await Quiz.findByPk(id);

  if (!quiz) {
    return next(new AppError(`there is no quiz with this id : ${id}`, 404));
  }

  await quiz.destroy();
  res.status(204).json({
    status: "success",
    data: null,
  });
});
