import mongoose, { Document, Schema } from "mongoose";

export interface ICounter extends Document {
  _id: string;
  //   isFirst: boolean;
  //   question: string;
  //   imageUrl: string;
  //   options: { text: string; nextQuizId: string }[];
  count: number;
}

// const optionSchema: Schema = new mongoose.Schema({
//   text: {
//     type: String,
//     required: true,
//   },
//   nextQuizId: {
//     type: String,
//     required: false,
//   },
// });

const counterSchema: Schema = new mongoose.Schema({
  count: {
    type: Number,
    require: true,
  },
});

const Counter =
  mongoose.models.Counter || mongoose.model<ICounter>("Counter", counterSchema);

export default Counter;
