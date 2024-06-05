import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/lib/models/Quiz";
import { getAuth } from "@clerk/nextjs/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";

export async function GET(
  req: Request,
  // res: NextResponse,
  { params }: { params: { id: string } }
) {
  const troubleShootId = params.id;

  await dbConnect();

  try {
    const troubleShoot = await TroubleShoot.findById(troubleShootId).exec();
    const relatedQuizzes = await Quiz.find({
      troubleShootId: troubleShootId,
    }).sort({ createdAt: 1 });
    console.log(troubleShoot, "troubleshoot found");
    console.log(relatedQuizzes, "relatedQuizzes");

    return NextResponse.json(
      { data: { questions: relatedQuizzes, troubleshoot: troubleShoot } },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching TroubleShoots:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
