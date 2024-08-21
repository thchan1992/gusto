import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { auth } from "@clerk/nextjs/server";
import Quiz from "@/lib/models/Quiz";
import { User } from "@/lib/models/User";
import mongoose from "mongoose";
import rateLimitMiddleware from "@/lib/rateLimit";

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  try {
    const { title, isFirst, troubleShootId, imageUrl } = await req.json();

    await dbConnect();

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found. Please register or contact an administrator.",
      });
    }

    const troubleShoot = await TroubleShoot.findById(troubleShootId);
    if (!troubleShoot) {
      return NextResponse.json({
        status: 404,
        message: "Troubleshoot not found",
      });
    }

    if (troubleShoot.createdBy !== userId) {
      return NextResponse.json({
        status: 403,
        message: "You do not have access.",
      });
    }

    if (troubleShoot.quizList.length >= 10 && !troubleShoot.isPublic) {
      return NextResponse.json({
        status: 400,
        message: "Cannot add more questions.",
      });
    }

    const isFirstQuestion = await Quiz.exists({ troubleShootId });

    const newQuestion = new Quiz({
      isFirst: !isFirstQuestion,
      imageUrl,
      question: title,
      options: [],
      createdBy: userId,
      troubleShootId,
    });

    const savedQuestion = await newQuestion.save();

    await TroubleShoot.findByIdAndUpdate(troubleShootId, {
      $push: { quizList: savedQuestion._id },
    });

    const relatedQuizzes = await Quiz.find({ troubleShootId })
      .sort({ createdAt: 1 })
      .exec();

    return NextResponse.json({
      status: 200,
      data: { questionList: relatedQuizzes, newQuestion: savedQuestion },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}, 10);
