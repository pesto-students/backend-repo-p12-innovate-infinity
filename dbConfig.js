import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

// using service of elephant SQL
const sequelize = new Sequelize(process.env.DB_TEST)

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;