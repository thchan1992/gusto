import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Quiz, { IQuiz } from "@/lib/models/Quiz";
import mongoose from "mongoose";

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    await dbConnect();

    const updateQuiz = async (quizId: string, updatedData: Partial<IQuiz>) => {
      try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updatedData, {
          new: true,
          runValidators: true,
        });
        if (!updatedQuiz) {
          //   throw new Error("Quiz not found");
          return NextResponse.json({ status: 400, message: "Invalid quizId" });
        }
        return updatedQuiz;
      } catch (error) {
        return NextResponse.json({ status: 500, message: "Server error" });
      }
    };

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const { updatedQuestion } = data;
    console.log(updatedQuestion);
    await updateQuiz(updatedQuestion._id, updatedQuestion);

    const relatedQuizzes = await Quiz.find({
      troubleShootId: updatedQuestion.troubleShootId,
    }).sort({ createdAt: 1 });

    return NextResponse.json({
      status: 200,
      data: { questionList: relatedQuizzes },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
