const dotenv = require("dotenv");
const app = require("./app.js");
const sequelize = require("./database.js");
// const User = require("./models/userModel.js")(sequelize, require('sequelize').DataTypes);
// const Quiz = require("./models/quizModel.js")(sequelize, require('sequelize').DataTypes);
// const Question = require("./models/questionModel.js")(sequelize, require('sequelize').DataTypes);
// const UserProgress = require("./models/userProgressModel.js")(sequelize, require('sequelize').DataTypes);
const {
  Quiz,
  User,
  Question,
  UserProgress,
} = require("./models/modelsCreator");

dotenv.config({ path: "./config.env" });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Failed to sync models:", err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App Running on port ${port} `);
});
