import { Router } from "express";
import { Request, Response } from "express";
import CouponModel from "../models/coupon.model";
import {
  checkRestId,
  validateApplyCoupon,
  validateCoupon,
} from "../utils/validation";

export const couponRouter = Router();

// Get all restaurant coupons by restaurant id
couponRouter.get("/:restId", async (req: Request, res: Response) => {
  try {
    const { restId } = req.params;

    // Check restaurant id
    const checkResult = await checkRestId(restId);
    if (checkResult === "string") return res.status(400).send(checkResult);

    const coupons = await CouponModel.find(
      {
        restId,
      },
      { __v: 0 }
    );

    // Response
    res.status(200).json(coupons);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Post new coupon
couponRouter.post("/", async (req: Request, res: Response) => {
  try {
    // Validate req body
    let validationResult = validateCoupon(req.body);
    if (validationResult)
      return res.status(400).send(validationResult.details[0].message);

    // Check if coupon already exist
    const couponCheck = await CouponModel.findOne({
      restId: req.body.restId,
      name: req.body.name,
    });
    if (couponCheck) return res.status(409).send("Coupon is already used");

    // Create new coupon
    const newCoupon = new CouponModel(req.body);

    // Save coupon
    const coupon = await newCoupon.save();

    // Response
    res.status(200).json(coupon);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Apply coupon
couponRouter.post("/:couponName", async (req: Request, res: Response) => {
  try {
    const { restId, timestamp } = req.body,
      { couponName } = req.params;

    // Validate req body
    let validationResult = validateApplyCoupon(req.body);
    if (validationResult)
      return res.status(400).send(validationResult.details[0].message);

    // Check coupon
    const coupon = await CouponModel.findOne({
      restId: restId,
      name: couponName,
    });

    if (
      !coupon ||
      !(timestamp > +coupon.startDate && timestamp < +coupon.endDate)
    )
      return res.status(409).send("Coupon is not valid");
    else if (coupon.usage === coupon.limit)
      return res.status(409).send("Coupon limit is out");

    // Update coupon usage
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      coupon._id,
      { usage: coupon.usage + 1 },
      { new: true }
    );

    // Response
    res.status(200).json(updatedCoupon);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete coupon
couponRouter.delete("/:couponName", async (req: Request, res: Response) => {
  try {
    const { restId } = req.body,
      { couponName } = req.params;

    // Check coupon
    const coupon = await CouponModel.findOne({
      restId: restId,
      name: couponName,
    });

    if (!coupon) return res.status(409).send("Coupon is not exist");

    await coupon.delete();

    // Response
    res.status(200).json(`Coupon ${couponName} deleted successfully`);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
