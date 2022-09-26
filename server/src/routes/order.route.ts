import { Router } from "express";
import { Request, Response } from "express";
import OrderModel from "../models/order.model";
import { checkRestId, validateOrder } from "../utils/validation";

export const orderRouter = Router();

// Get all restaurant orders by restaurant id
orderRouter.get("/:restId", async (req: Request, res: Response) => {
  try {
    const { restId } = req.params;

    // Check restaurant id
    const checkResult = await checkRestId(restId);
    if (checkResult === "string") return res.status(400).send(checkResult);

    const orders = await OrderModel.find(
      {
        restId,
      },
      { __v: 0 }
    );

    // Response
    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Post new order
orderRouter.post("/", async (req: Request, res: Response) => {
  try {
    // Validate req body
    let validationResult = validateOrder(req.body);
    if (validationResult)
      return res.status(400).send(validationResult.details[0].message);

    // Create new order
    const newOrder = new OrderModel(req.body);

    // Save order
    const order = await newOrder.save();

    // Response
    res.status(200).json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
