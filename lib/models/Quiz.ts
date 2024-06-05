import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IQuiz extends Document {
  // _id: string;
  isFirst: boolean;
  imageUrl: string;
  question: string;
  options: { text: string; nextQuizId?: mongoose.Schema.Types.ObjectId }[];
  createdBy: mongoose.Schema.Types.ObjectId;
  troubleShootId: mongoose.Schema.Types.ObjectId;
}

const optionSchema: Schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  nextQuizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: false,
  },
});

const quizSchema: Schema = new Schema<IQuiz>(
  {
    isFirst: { type: Boolean, required: true },
    imageUrl: { type: String, required: false },
    question: { type: String, required: true },
    options: [optionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    troubleShootId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TroubleShoot",
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", quizSchema);

export default Quiz;
