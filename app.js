const express = require("express");
const morgan = require("morgan");
const authRouter = require("./routes/authRoute");
const quizRouter = require("./routes/quizRoute");
const questionRouter = require("./routes/questionRoute");
const userProgressRouter = require("./routes/userProgressRoute");
const cookieParser = require("cookie-parser");
const app = express();

app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/users", authRouter);
app.use("/api/v1/quizzes", quizRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/progress", userProgressRouter);

module.exports = app;
