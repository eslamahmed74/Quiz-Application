module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define(
    "Quiz",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      freezeTableName: true, // Prevent pluralization
    }
  );

  // Quiz.associate = (models) => {
  //   Quiz.hasMany(models.Question, {
  //     foreignkey: "quiz_id",
  //     as: "questions",
  //   });
  // };

  return Quiz;
};
