import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { auth } from "@clerk/nextjs/server";
import Quiz from "@/lib/models/Quiz";
import { User } from "@/lib/models/User";
import mongoose from "mongoose";
import rateLimitMiddleware from "@/lib/rateLimit";

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  // export async function POST(req: Request) {
  try {
    const data = await req.json();

    await dbConnect();

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found. Please register or contact an administrator.",
      });
    }

    const { title, isFirst, troubleShootId, imageUrl } = data;

    const troubleShoot = await TroubleShoot.findOne({
      _id: new mongoose.Types.ObjectId(troubleShootId),
    });

    if (troubleShoot.quizList.length > 10 && !troubleShoot.isPublic) {
      return NextResponse.json({
        status: 400,
        message: "Cannot add more question.",
      });
    } else {
      const troubleShoot = await TroubleShoot.findById(troubleShootId).exec();

      console.log(troubleShoot.createdBy, "created by");
      console.log(userId, "user Id");
      if (troubleShoot.createdBy !== userId) {
        return NextResponse.json({
          status: 401,
          message: "You do not have the access.",
        });
      }
      const question = await Quiz.findOne({
        troubleShootId: new mongoose.Types.ObjectId(troubleShootId),
      });

      const newQuestion = new Quiz({
        isFirst: question !== null ? false : true,
        imageUrl: imageUrl,
        question: title,
        options: [],
        createdBy: user._id,
        troubleShootId: troubleShootId,
      });

      const savedQuestion = await newQuestion.save();

      await TroubleShoot.findByIdAndUpdate(troubleShootId, {
        $push: { quizList: savedQuestion._id },
      });

      const relatedQuizzes = await Quiz.find({
        troubleShootId: troubleShootId,
      }).sort({ createdAt: 1 });

      // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

      return NextResponse.json({
        status: 200,
        data: { questionList: relatedQuizzes, newQuestion: savedQuestion },
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}, 6);
