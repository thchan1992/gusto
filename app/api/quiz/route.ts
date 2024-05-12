import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/lib/models/Quiz";
import { getAuth } from "@clerk/nextjs/server";
export async function GET(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const { userId } = getAuth(req);

  if (userId) {
    try {
      const quizzes = await Quiz.find({});
      console.log(quizzes, "quizze");
      return NextResponse.json({ data: quizzes }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
