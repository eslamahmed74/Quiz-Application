const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const { User } = require("../models/modelsCreator");
const { where } = require("sequelize");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const { toUnicode } = require("punycode");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOIKE_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const createHashPassword = catchAsync(async (password) => {
  return await bcrypt.hash(String(password), 10);
});

const correctPassword = async (reqPassword, dbPassword) => {
  return (isMatch = await bcrypt.compare(String(reqPassword), dbPassword));
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      status: "fail",
      message: "email already in use",
    });
  }

  const hashedPassword = await createHashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });

  createAndSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  const user = await User.findOne({ where: { email } });

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Invalid Email or Password", 401));
  }

  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        "You are not allowed to access this page. login to get access",
        401
      )
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const id = decode.id;
  const currentUser = await User.findOne({ where: { id } });

  if (!currentUser) {
    return next(new AppError("this user is no longer exist", 401));
  }

  //TODO
  // CHECK THAT USER CHANGE PASSWORD AFTER THE TOKEN IS CREATED ;

  req.user = currentUser;
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You don't have the permission to perform this action ",
          403
        )
      );
    }
    next();
  };
};
