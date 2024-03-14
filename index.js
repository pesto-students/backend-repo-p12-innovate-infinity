import Express from "express";
import * as dotenv from "dotenv";
import db from "./dbConfig.js";
import authHandler from "./handlers/auth.js";

dotenv.config();

const app = Express();

const port = process.env.PORT || 4000;

app.use(Express.json({ extended: false }));

db.sequelize
  .sync()
  .then(() => console.log("db synced"))
  .catch((err) => console.log("Failed to sync db" + err));

app.use("/auth", authHandler);

app.get("/*", async (req, res) => {
  res.status(404).json({ msg: "route not found" });
});



const appName = "WanderSolo API";

app.listen(port, () => {
  console.log(`${appName} listening on port ${port}`);
});
