import Express from 'express';
import { body } from "express-validator";
import auth from "../middlewares/auth.js";
import rejectBadRequests from "../services/validationService.js";
import dotenv from "dotenv";
dotenv.config();

const Router = Express.Router();

const loginBodyValidators = [
  body("email").notEmpty().withMessage("name field is required"),
  body("password").notEmpty().withMessage("password field is required"),
];

/**
 * verify token
 */
Router.get("/", auth, async (req, res) => {
  // verify token and send user details
  res.send("user detail api")
});

/**
 * login
 */
Router.post("/", loginBodyValidators, rejectBadRequests, async (req, res) => {
  // user login method
  res.send("user login api")
});

export default Router;
