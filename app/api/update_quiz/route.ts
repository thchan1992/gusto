import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Quiz, { IQuiz } from "@/lib/models/Quiz";
import mongoose from "mongoose";
import rateLimitMiddleware from "@/lib/rateLimit";

type Option = {
  text: string;
  nextQuizId?: mongoose.Types.ObjectId | null;
};

interface IQuizUpdate {
  _id: string;
  isFirst?: boolean;
  imageUrl?: string;
  question?: string;
  options?: Option[];
  createdBy?: string;
  troubleShootId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export const PUT = rateLimitMiddleware(async (req: NextRequest) => {
  // export async function PUT(req: Request) {
  try {
    const data = await req.json();

    await dbConnect();

    const updateQuiz = async (
      quizId: string,
      updatedData: Partial<IQuizUpdate>
    ) => {
      if (updatedData.options) {
        updatedData.options = updatedData.options.map((option) => ({
          ...option,
          nextQuizId: option.nextQuizId
            ? new mongoose.Types.ObjectId(option.nextQuizId.toString())
            : null,
        })) as Option[];
      }

      try {
        const updatedQuizToCheck = await Quiz.findById(quizId);
        if (updatedQuizToCheck.createdBy !== userId) {
          return NextResponse.json({
            status: 401,
            message: "You do not have the access.",
          });
        }
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updatedData, {
          new: true,
          runValidators: true,
        });

        if (!updatedQuiz) {
          return NextResponse.json({ status: 400, message: "Invalid quizId" });
        }
        return updatedQuiz;
      } catch (error) {
        console.error("Error updating quiz:", error);
        return NextResponse.json({ status: 500, message: "Server error" });
      }
    };

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const { updatedQuestion } = data;
    console.log(updatedQuestion, "update Question");

    if (updatedQuestion.isFirst === true) {
      await Quiz.updateOne(
        {
          troubleShootId: new mongoose.Types.ObjectId(
            updatedQuestion.troubleShootId
          ),
          isFirst: true,
        },
        { isFirst: false }
      );
    }

    const result = await updateQuiz(updatedQuestion._id, updatedQuestion);

    if (result?.status) {
      return result;
    }

    const relatedQuizzes = await Quiz.find({
      troubleShootId: updatedQuestion.troubleShootId,
    }).sort({ createdAt: 1 });
    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return NextResponse.json({
      status: 200,
      data: { questionList: relatedQuizzes },
    });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}, 10);
