import mongoose, { Schema, Document } from "mongoose";

export interface ITroubleShoot extends Document {
  quizList: mongoose.Schema.Types.ObjectId[];
  title: string;
  createdBy: string;
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
  },
  { timestamps: true }
);

export const TroubleShoot =
  mongoose.models.TroubleShoot ||
  mongoose.model<ITroubleShoot>("TroubleShoot", troubleShootSchema);
