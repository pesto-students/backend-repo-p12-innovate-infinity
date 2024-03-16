import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

import { journey } from "./models/journey.js";
import { user } from "./models/user.js";
import { post } from "./models/post.js";

// using service of elephant SQL
const sequelize = new Sequelize(process.env.DB_TEST);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.journey = journey(Sequelize, sequelize);
db.user = user(Sequelize, sequelize);
db.post = post(Sequelize, sequelize);

export default db;
