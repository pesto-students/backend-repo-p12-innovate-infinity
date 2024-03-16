export const user = (sequelize, Sequelize) => {
  const table = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dob: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    bio: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    interests: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    followers: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    follows: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    enabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });
  return table;
};
