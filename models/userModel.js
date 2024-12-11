const { User } = require("./modelsCreator");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      freezeTableName: true, // Prevent pluralization
    }
  );

  // User.associate = (models) => {
  //   User.hasMany(models.UserProgress, {
  //     foreignkey: "user_id",
  //     as: "progress",
  //   });
  // };

  return user;
};
