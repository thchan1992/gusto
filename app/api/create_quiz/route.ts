// import dbConnect from "@/lib/dbConnect";
// import { NextResponse, NextRequest } from "next/server";
// import { User } from "@/lib/models/User";
// import { getAuth } from "@clerk/nextjs/server";
// import { TroubleShoot } from "@/lib/models/TroubleShoot";

// export async function POST(req: Request) {
//   const data = await req.json();
//   await dbConnect();
//   //   const { userId } = getAuth(req);
//   console.log(data);

// }

import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { auth } from "@clerk/nextjs/server";
import Quiz from "@/lib/models/Quiz";
import { User } from "@/lib/models/User";
import mongoose from "mongoose";
export async function POST(req: Request) {
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

    const { title, isFirst, troubleShootId } = data;

    //see if we have any question in the collection
    const question = await Quiz.findOne({
      troubleShootId: new mongoose.Types.ObjectId(troubleShootId),
    });

    const newQuestion = new Quiz({
      isFirst: question !== null ? false : true,
      imageUrl: "",
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

    return NextResponse.json({
      status: 200,
      data: { questionList: relatedQuizzes, newQuestion: savedQuestion },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
