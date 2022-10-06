import mongoose, { ObjectId } from "mongoose";

export type RestaurantProps = {
  name: string;
  logo: string;
  background: string;
  currency: string;
  vatNum: string;
  categories?: { value: string }[];
  userId: ObjectId;
};

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    background: { type: String, required: true },
    currency: { type: String, required: true },
    vatNum: { type: String, required: true },
    categories: { type: Array, default: [] },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const RestaurantModel = mongoose.model<RestaurantProps>(
  "Restaurant",
  restaurantSchema
);

export default RestaurantModel;
