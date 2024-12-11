const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: false,
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to database successfully");
  } catch (err) {
    console.error("unable to connect to database", err);
  }
})();

module.exports = sequelize;
