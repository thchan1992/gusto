import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Quiz, { IQuiz } from "@/lib/models/Quiz";
import mongoose from "mongoose";

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    console.log(data.updatedQuestion, "updated Question");

    await dbConnect();

    const updateQuiz = async (quizId: string, updatedData: Partial<IQuiz>) => {
      console.log(quizId, "quizId");
      console.log(updatedData, "updatedData");

      if (updatedData.options) {
        updatedData.options = updatedData.options.map((option) => ({
          ...option,
          nextQuizId: option.nextQuizId
            ? new mongoose.Schema.Types.ObjectId(option.nextQuizId.toString())
            : null,
        })) as {
          text: string;
          nextQuizId?: mongoose.Schema.Types.ObjectId | null;
        }[];
      }

      try {
        console.log("try");
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updatedData, {
          new: true,
          runValidators: true,
        });

        console.log(updatedQuiz, "updated Quiz");
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

    return NextResponse.json({
      status: 200,
      data: { questionList: relatedQuizzes },
    });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
