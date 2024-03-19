import Express from "express";
import { body } from "express-validator";
import auth from "../middlewares/auth.js";
import rejectBadRequests from "../services/validationService.js";
import dotenv from "dotenv";
import { postService, userService } from "../services/modelServices.js";
dotenv.config();

const Router = Express.Router();

// TODO include payment details as well
const postBodyValidators = [
  //   body("name").notEmpty().withMessage("name field is required"),
  //   body("phone").notEmpty().withMessage("phone field is required"),
  //   body("email").notEmpty().withMessage("email field is required"),
  //   body("password").notEmpty().withMessage("password field is required"),
];

/**
 * get all posts
 */

// TODO add validators
Router.get("/", auth, async (req, res) => {
  try {
    const posts = await postService.findAll();

    return res.status(200).json({
      message: "post list.",
      success: true,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

/**
 * get all posts of a user
 */

// TODO add validators
Router.get("/my-posts", auth, async (req, res) => {
  try {
    const posts = await postService.findAll({
      where: { userIdFK: req.user.id },
    });

    return res.status(200).json({
      message: "posts list by user.",
      success: true,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

/**
 * create a post
 */

// TODO add validators
Router.post(
  "/",
  auth,
  postBodyValidators,
  rejectBadRequests,
  async (req, res) => {
    try {
      const post = await postService.createOne({
        ...req.body,
        userIdFK: req.user.id,
      });

      return res
        .status(201)
        .json({ message: "post created successfully", success: true });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Some error occured", success: false });
    }
  }
);

/**
 * post update api
 */
// TODO add validators
Router.patch("/:postId", auth, async (req, res) => {
  // TODO remove unwanted properties from req.body

  try {
    const post = await postService.findOne({
      where: { id: req.params.postId },
    });

    if (post.userIdFK !== req.user.id) {
      return res.status(400).json({
        message:
          "You are not authorized to make changes to another persons post.",
        success: false,
      });
    } else {
      await postService.update({ id: req.params.postId }, req.body);
    }

    return res
      .status(200)
      .json({ message: "post updated successfully", success: true });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

/**
 * post delete api
 */
// TODO add validators
Router.delete("/:postId", auth, async (req, res) => {
  // TODO remove unwanted properties from req.body

  try {
    const post = await postService.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    }

    if (post.userIdFK !== req.user.id) {
      return res.status(400).json({
        message:
          "You are not authorized to make changes to another persons post.",
        success: false,
      });
    } else {
      await postService.delete({ id: req.params.postId });
    }

    return res
      .status(200)
      .json({ message: "post deleted successfully", success: true });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
});

export default Router;
