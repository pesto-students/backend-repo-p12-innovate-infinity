import Express from "express";
import * as dotenv from "dotenv";
import db from "./dbConfig.js";
import authHandler from "./handlers/auth.js";
import postHandler from "./handlers/post.js";
import journeyHandler from "./handlers/journey.js";
import userHandler from "./handlers/user.js";
import Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

dotenv.config();

const app = Express();
Sentry.init({
  dsn: "https://51a80daa310b80c497f42bd1858791f8@o4506930572558336.ingest.us.sentry.io/4506930582388736",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

const port = process.env.PORT || 4000;

app.use(Express.json({ extended: false }));

db.sequelize
  .sync()
  .then(() => console.log("db synced"))
  .catch((err) => console.log("Failed to sync db" + err));

app.use("/auth", authHandler);
app.use("/journey", journeyHandler);
app.use("/post", postHandler);
app.use("/user", userHandler);

app.get("/*", async (req, res) => {
  res.status(404).json({ msg: "route not found" });
});

const appName = "WanderSolo API";

app.listen(port, () => {
  console.log(`${appName} listening on port ${port}`);
});
