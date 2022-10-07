import { Router } from "express";
import { Request, Response } from "express";
import UserModel from "../models/user.model";
import {
  checkUserId,
  validateUpdateUserLinks,
  validateUser,
} from "../utils/validation";

export const userRouter = Router();

// Get user by id
userRouter.get("/:userId", async (req: Request, res: Response) => {
  try {
    let user;
    const { userId } = req.params;

    // Check user id
    const checkResult = await checkUserId(userId);
    typeof checkResult === "string"
      ? res.status(400).send(checkResult)
      : (user = checkResult);

    // Response
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update user by id
userRouter.put("/:userId", async (req: Request, res: Response) => {
  let user;
  const { userId } = req.params;

  try {
    // Validate req body
    let validationResult = validateUser(req.body);
    if (validationResult)
      return res.status(400).send(validationResult.details[0].message);

    // Check user id
    const checkResult = await checkUserId(userId);
    typeof checkResult === "string"
      ? res.status(400).send(checkResult)
      : (user = checkResult);

    // Check email
    if (user?.email !== req.body.email) {
      let emailCheck = await UserModel.findOne({ email: req.body.email });
      if (emailCheck) return res.status(409).json("Email is already used");
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    ).select("-password -createdAt -updatedAt");

    // Response
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update user social links by id
userRouter.put("/links/:userId", async (req: Request, res: Response) => {
  let user;
  const { userId } = req.params;

  try {
    // Validate req body
    let validationResult = validateUpdateUserLinks(req.body);
    if (validationResult)
      return res.status(400).send(validationResult.details[0].message);

    // Check user id
    const checkResult = await checkUserId(userId);
    typeof checkResult === "string"
      ? res.status(400).send(checkResult)
      : (user = checkResult);

    // Update user
    const updatedLinks = await UserModel.findByIdAndUpdate(
      userId,
      { socialLinks: req.body.socialLinks },
      { new: true }
    ).select("socialLinks");

    // Response
    res.status(200).json(updatedLinks);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
