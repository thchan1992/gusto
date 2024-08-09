type Params = {
  id: string;
  troubleShootId: string;
};

import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Quiz from "@/lib/models/Quiz";
import mongoose from "mongoose";
import { TroubleShoot } from "@/lib/models/TroubleShoot";

export async function DELETE(request: Request, context: { params: Params }) {
  try {
    // const id = context.params.id;
    const troubleShootId = context.params.id;
    await dbConnect();

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const deleteTroubleshoot = async (troubleShootId: string) => {
      try {
        const deleteTroubleshoot = await TroubleShoot.findById(troubleShootId);

        if (deleteTroubleshoot.createdBy !== userId) {
          return NextResponse.json({
            status: 401,
            message: "You do not have the access.",
          });
        }

        if (!deleteTroubleshoot) {
          return NextResponse.json({
            status: 400,
            message: "Invalid Troubleshoot",
          });
        }

        await TroubleShoot.findByIdAndDelete(troubleShootId);
        return deleteTroubleshoot;
      } catch (error) {
        return NextResponse.json({ status: 500, message: "Server error" });
      }
    };

    await deleteTroubleshoot(troubleShootId);

    // const relatedQuizzes = await Quiz.find({
    //   troubleShootId: troubleShootId,
    // }).sort({ createdAt: 1 });

    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    return NextResponse.json({
      status: 200,
      //   data: { questionList: relatedQuizzes },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
