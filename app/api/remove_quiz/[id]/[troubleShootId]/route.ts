type Params = {
  id: string;
  troubleShootId: string;
};

import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Quiz from "@/lib/models/Quiz";
import { TroubleShoot } from "@/lib/models/TroubleShoot";

export async function DELETE(request: Request, context: { params: Params }) {
  try {
    const id = context.params.id;
    const troubleShootId = context.params.troubleShootId;
    await dbConnect();

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const deleteQuiz = async (quizId: string) => {
      try {
        const deletedQuiz = await Quiz.findById(quizId);
        if (deletedQuiz.createdBy !== userId) {
          return NextResponse.json({
            status: 401,
            message: "You do not have the access.",
          });
        }
        const deleteQuiz = await Quiz.findByIdAndDelete(quizId);

        if (!deleteQuiz) {
          return NextResponse.json({ status: 400, message: "Invalid quizId" });
        }

        // Remove the quiz from the TroubleShoot's quizList
        await TroubleShoot.findByIdAndUpdate(troubleShootId, {
          $pull: { quizList: quizId },
        });

        return deletedQuiz;
      } catch (error) {
        return NextResponse.json({ status: 500, message: "Server error" });
      }
    };

    await deleteQuiz(id);

    const relatedQuizzes = await Quiz.find({
      troubleShootId: troubleShootId,
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
