const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

const Quiz = require("./quizModel")(sequelize, DataTypes);
const User = require("./userModel")(sequelize, DataTypes);
const Question = require("./questionModel")(sequelize, DataTypes);
const UserProgress = require("./userProgressModel")(sequelize, DataTypes);

const models = { Quiz, User, Question, UserProgress };


User.hasMany(UserProgress, { foreignKey: "user_id", as: "progress" });
UserProgress.belongsTo(User, { foreignKey: "user_id", as: "user" });

Quiz.hasMany(Question, { foreignKey: "quiz_id", as: "questions" });
Question.belongsTo(Quiz, { foreignKey: "quiz_id", as: "quiz" });

Quiz.hasMany(UserProgress, { foreignKey: "quiz_id", as: "progress" });
UserProgress.belongsTo(Quiz, { foreignKey: "quiz_id", as: "quiz" });

module.exports = {
  sequelize,
  User,
  Quiz,
  Question,
  UserProgress,
};
