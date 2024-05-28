import { Schema, models, model, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  _id: Types.ObjectId;
  userId: string;
  // role: "user" | "admin";
}
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userId: { type: String, required: true, unique: true },
    // role: {
    //   type: String,
    //   enum: ["user", "admin"],
    //   default: "user",
    // },
  },
  { timestamps: true }
);
export const User = models.User || model("User", userSchema);
