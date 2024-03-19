export const journey = (sequelize, Sequelize) => {
  const table = sequelize.define("journey", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userIdFK: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATE,
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
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tags: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    pictures: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    videos: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    description: {
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
    itinerary: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  });
  return table;
};
