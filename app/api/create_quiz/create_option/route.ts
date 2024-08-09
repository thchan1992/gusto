import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Quiz from "@/lib/models/Quiz";
import mongoose from "mongoose";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await dbConnect();

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const { quizId, optionList } = data;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ status: 400, message: "Invalid quizId" });
    }

    const quizToUpdate = await Quiz.findById(quizId);

    console.log("updating options");

    if (quizToUpdate.createdBy !== userId) {
      return NextResponse.json({
        status: 401,
        message: "You do not have the access.",
      });
    }

    const transformedOptions = optionList.map((option: any) => {
      let nextQuizId;
      if (option.nextQuizId && option.nextQuizId !== "") {
        if (mongoose.Types.ObjectId.isValid(option.nextQuizId)) {
          nextQuizId = new mongoose.Types.ObjectId(option.nextQuizId);
        } else {
          console.warn(
            `Invalid nextQuizId: ${option.nextQuizId}. Treating as undefined.`
          );
          nextQuizId = null;
        }
      } else {
        nextQuizId = null;
      }

      return {
        text: option.text,
        nextQuizId: nextQuizId,
      };
    });

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $set: { options: transformedOptions } },
      { new: true, runValidators: true }
    ).exec();
    const relatedQuizzes = await Quiz.find({
      troubleShootId: updatedQuiz.troubleShootId,
    })
      .sort({ createdAt: 1 })
      .exec();

    if (!updatedQuiz) {
      return NextResponse.json({ status: 404, message: "Quiz not found" });
    }

    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return NextResponse.json({
      status: 200,
      data: { updatedQuiz: updatedQuiz, questionList: relatedQuizzes },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
