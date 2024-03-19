import Express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import auth from "../middlewares/auth.js";
import rejectBadRequests from "../services/validationService.js";
import dotenv from "dotenv";
import { userService } from "../services/modelServices.js";
dotenv.config();

const Router = Express.Router();

// TODO include payment details as well
const userPostBodyValidators = [
  body("name").notEmpty().withMessage("name field is required"),
  body("phone").notEmpty().withMessage("phone field is required"),
  body("email")
    .isEmail()
    .withMessage("Email should be in email format")
    .notEmpty()
    .withMessage("email field is required"),
  body("password").notEmpty().withMessage("password field is required"),
];

/**
 * create a user
 */
Router.post(
  "/",
  userPostBodyValidators,
  rejectBadRequests,
  async (req, res) => {
    const { password, email, ...userDetails } = req.body;

    const emailLowerCase = email.toLowerCase();

    try {
      let user = await userService.findOne({
        where: { email: emailLowerCase },
      });

      if (user) {
        return res.status(409).json({
          message: "User already exists with this email",
          success: false,
        });
      }

      user = await userService.findOne({
        where: { phone: userDetails.phone },
      });

      if (user) {
        return res.status(409).json({
          message: "User already exists with this phone",
          success: false,
        });
      }

      const salt = await bcrypt.genSalt(10);

      const passwordVar = await bcrypt.hash(password, salt);

      user = await userService.createOne({
        ...userDetails,
        email: emailLowerCase,
        password: passwordVar,
      });

      const payload = {
        user: {
          id: user.id,
        },
      };

      const userDetails = await userService.findOne({
        where: { id: user.id },
        attributes: { exclude: ["password"] },
      });

      // TODO remove password from here
      // TODO check time for token
      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.status(201).json({
            message: "user created succesfully.",
            success: true,
            token,
            userDetails,
          });
        }
      );

      return;
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Some error occured", success: false });
    }
  }
);

/**
 * User update api
 */
Router.patch("/", auth, async (req, res) => {
  // TODO remove unwanted properties from req.body
  try {
    const user = await userService.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "no user found with this user ID", success: false });
    }
    await userService.update({ id: req.user.id }, req.body);

    return res.status(200).json({
      message: "user updated succesfully.",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

// // TODO change to patch
// /**
//  * User image update api
//  */
// Router.post(
//   "/image/:userId",
//   auth,
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       image = await cloudinary.uploader.upload(req?.file?.path);
//     } catch (error) {
//       console.log(error);
//     }

//     var data = { profile_image: image?.secure_url };

//     try {
//       const user = await User.find({ userreference: req.params.userId });

//       if (!user) {
//         return res.status(404).send({ msg: "no user found with this user ID" });
//       }

//       await User.findOneAndUpdate({ userreference: req.params.userId }, data)
//         .then(() => {
//           return res.status(200).send("User details updated successfully");
//         })
//         .catch((err) => {
//           console.log(err);
//           res.status(400).send(err);
//           return;
//         });
//     } catch (err) {
//       console.log(err.message);
//       res.status(500).send("server error");
//     }
//   }
// );

export default Router;
