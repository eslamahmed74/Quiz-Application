// const sequelize = require("../database");
// const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const UserProgress = sequelize.define(
    "UserProgress",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      quiz_id: { type: DataTypes.UUID, allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false },
      current_question_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      completed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      freezeTableName: true, // Prevent pluralization
    }
  );

  // UserProgress.associate = (models) => {
  //   UserProgress.belongsTo(models.User, {
  //     foreignkey: "user_id",
  //     as: "user",
  //   });
  //   UserProgress.belongsTo(models.Quiz, {
  //     foreignkey: "quiz_id",
  //     as: "quiz",
  //   });
  // };

  return UserProgress;
};
