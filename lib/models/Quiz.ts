import mongoose, { Document, Schema } from "mongoose";

export interface IQuiz extends Document {
  isFirst: boolean;
  imageUrl: string;
  question: string;
  options: {
    text: string;
    nextQuizId?: mongoose.Schema.Types.ObjectId | null;
  }[];
  // createdBy: mongoose.Schema.Types.ObjectId;
  createdBy: string;
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
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
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
