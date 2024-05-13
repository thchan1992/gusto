import { Schema, models, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  _id: string;
  // role: "user" | "admin";
}
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    _id: { type: String, required: true, unique: true },
    // role: {
    //   type: String,
    //   enum: ["user", "admin"],
    //   default: "user",
    // },
  },
  { timestamps: true }
);
export const User = models.User || model("User", userSchema);
