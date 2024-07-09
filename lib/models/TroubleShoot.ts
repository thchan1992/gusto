import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITroubleShoot extends Document {
  quizList: Types.ObjectId[];
  title: string;
  createdBy: string;
  isPublic: boolean;
  token: string | null;
}

const troubleShootSchema: Schema = new Schema<ITroubleShoot>(
  {
    quizList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    title: { type: String, required: true },
    createdBy: {
      type: String,
      ref: "User",
      required: true,
    },
    isPublic: { type: Boolean, default: false },
    token: { type: String, default: null },
  },
  { timestamps: true }
);

export const TroubleShoot =
  mongoose.models.TroubleShoot ||
  mongoose.model<ITroubleShoot>("TroubleShoot", troubleShootSchema);
