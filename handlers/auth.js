import Express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import auth from "../middlewares/auth.js";
import rejectBadRequests from "../services/validationService.js";
import dotenv from "dotenv";
import { userService } from "../services/modelServices.js";
import Sib from "sib-api-v3-sdk";
dotenv.config();

const Router = Express.Router();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const IS_PROD = process.env.NODE_ENV === "production";
// TODO change with server location or domain name
const API_URL = IS_PROD ? "www.successthinks.com" : "http://localhost:3000";

const loginBodyValidators = [
  body("email").notEmpty().withMessage("name field is required"),
  body("password").notEmpty().withMessage("password field is required"),
];

/**
 * verify token
 */
Router.get("/", auth, async (req, res) => {
  try {
    // Todo remove password from body
    const user = await userService.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });
    return res
      .status(200)
      .json({ message: "user details", success: false, user });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

/**
 * login
 */
Router.post(
  "/",
  loginBodyValidators,
  rejectBadRequests,

  async (req, res) => {
    const { email, password } = req.body;

    const emailLowerCase = email.toLowerCase();

    try {
      const user = await userService.findOne({
        where: { email: emailLowerCase },
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: [{ msg: "Wrong Password" }] });
      }

      if (user.enabled !== true) {
        return res.status(401).json({
          error: [
            { msg: "Your Account is not enabled. Please contact admin." },
          ],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.status(200).json({
            message: "user logged in succesfully.",
            success: true,
            token,
          });
        }
      );

      return;
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "Some error occured", success: false });
    }
  }
);

/**
 * forgot password requests
 */
// TODO
Router.post("/forgot-password", async (req, res) => {
  const emailLowerCase = req.body.email.toLowerCase();

  try {
    const user = await userService.findOne({
      where: { email: emailLowerCase },
    });

    if (!user) {
      return res.status(404).json({
        message: "No user found with provided email address.",
        success: false,
      });
    } else {
      var payload = {
        user: {
          id: user.id,
        },
      };

      var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "4h",
      });

      // TODO add email template and account
      const tranEmailApi = new Sib.TransactionalEmailsApi();
      // TODO change the below credentials
      const sender = {
        email: "",
        name: "",
      };
      const receivers = [
        {
          email: user.email,
        },
      ];

      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: `Reset Password for ${user.name}`,
          htmlContent: `<p>Below is your password reset link <br/> 
        <a clicktracking="off" href="${API_URL}/reset-password?token=${token}" >
        click here</a> <br/>
         This link is only valid for 4 hours </p>`,
        })
        .then(() => {
          return res.status(200).json({
            message:
              "Email with reset link has been sent to registered email address",
            success: true,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({
            message:
              "Some error occurred while sending email. Please try again or contact admin",
            success: false,
          });
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

/**
 * reset password
 */
Router.post("/reset-password", async (req, res) => {
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = decoded.user.id;

    const user = await userService.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Unable to authenticate token. Please initiate a new forgot password request",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);

    const password = await bcrypt.hash(req.body.password, salt);

    await userService.update({ where: { id: req.user.id } }, { password });

    return res.status(200).json({
      message: "password updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message:
        "Unable to authenticate token. Please initiate a new forgot password request",
      success: false,
    });
  }
});

export default Router;
