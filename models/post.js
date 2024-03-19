export const post = (sequelize, Sequelize) => {
  const table = sequelize.define("post", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userIdFK: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    tags: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    pictures: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    videos: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    descriptions: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    enabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });
  return table;
};
