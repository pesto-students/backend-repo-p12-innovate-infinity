import Express from "express";
import auth from "../middlewares/auth.js";
import rejectBadRequests from "../services/validationService.js";
import dotenv from "dotenv";
import { journeyService, userService } from "../services/modelServices.js";
dotenv.config();

const Router = Express.Router();

// TODO include payment details as well
const journeyBodyValidators = [
  //   body("name").notEmpty().withMessage("name field is required"),
  //   body("phone").notEmpty().withMessage("phone field is required"),
  //   body("email").notEmpty().withMessage("email field is required"),
  //   body("password").notEmpty().withMessage("password field is required"),
];

/**
 * get all journeys
 */

// TODO add validators
Router.get("/", auth, async (req, res) => {
  try {
    const journeys = await journeyService.findAll();

    return res.status(200).json({
      message: "journey list.",
      success: true,
      data: journeys,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

/**
 * get all journeys by user
 */

// TODO add validators
Router.get("/my-journeys", auth, async (req, res) => {
  try {
    const journeys = await journeyService.findAll({
      where: { userIdFK: req.user.id },
    });

    return res.status(200).json({
      message: "journey list.",
      success: true,
      data: journeys,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

/**
 * create a journey
 */

// TODO add validators
Router.post(
  "/",
  auth,
  journeyBodyValidators,
  rejectBadRequests,
  async (req, res) => {
    try {
      const journey = await journeyService.createOne({
        ...req.body,
        userIdFK: req.user.id,
      });

      return res
        .status(201)
        .json({ message: "journey created successfully", success: true });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Some error occured", success: false });
    }
  }
);

/**
 * journey update api
 */
// TODO add validators
Router.patch("/:journeyId", auth, async (req, res) => {
  // TODO remove unwanted properties from req.body

  try {
    const journey = await journeyService.findOne({
      where: { id: req.params.journeyId },
    });

    if (journey.userIdFK !== req.user.id) {
      return res.status(400).json({
        message:
          "You are not authorized to make changes to another persons journeys.",
      });
    } else {
      await journeyService.update({ id: req.params.journeyId }, req.body);
    }

    return res
      .status(200)
      .json({ message: "journey updated successfully", success: true });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

/**
 * journey delete api
 */
// TODO add validators
Router.delete("/:journeyId", auth, async (req, res) => {
  // TODO remove unwanted properties from req.body

  try {
    
    const journey = await journeyService.findOne({
      where: { id: req.params.journeyId },
    });

    if (!journey) {
      return res
        .status(404)
        .json({ message: "Journey not found", success: false });
    }

    if (journey.userIdFK !== req.user.id) {
      return res.status(400).json({
        message:
          "You are not authorized to make changes to another persons journey.",
      });
    } else {
      await journeyService.delete({ id: req.params.journeyId });
    }

    return res
      .status(200)
      .json({ message: "journey deleted successfully", success: true });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

export default Router;