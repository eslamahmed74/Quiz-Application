module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      quiz_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      correct_answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true, // Prevent pluralization
    }
  );
  // Question.associate = (models) => {
  //   Question.belongsTo(models.Quiz, {
  //     foreignkey: "quiz_id",
  //     as: "quiz",
  //   });
  // };
  return Question;
};
