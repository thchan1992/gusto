import mongoose, { Document, Schema } from "mongoose";

export interface IQuiz extends Document {
  _id: string;
  isFirst: boolean;
  question: string;
  imageUrl: string;
  options: { text: string; nextQuizId: string }[];
}

const optionSchema: Schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  nextQuizId: {
    type: String,
    required: false,
  },
});

const quizSchema: Schema = new mongoose.Schema({
  isFirst: {
    type: Boolean,
    require: true,
  },
  question: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: false,
  },
  option: [optionSchema],
});

const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", quizSchema);

export default Quiz;
