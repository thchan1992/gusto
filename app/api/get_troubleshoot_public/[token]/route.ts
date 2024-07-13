import dbConnect from "@/lib/dbConnect";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { NextResponse } from "next/server";
import Quiz from "@/lib/models/Quiz";
export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  await dbConnect();

  const token = params.token;
  // const { token } = await req.json();

  try {
    const troubleshoot = await TroubleShoot.findOne({ token: token }).exec();
    const relatedQuestions = await Quiz.find({
      troubleShootId: troubleshoot._id,
    }).sort({ createdAt: 1 });

    console.log(token);
    if (!troubleshoot) {
      return NextResponse.json(
        { message: "Troubleshoot not found" },
        { status: 404 }
      );
    }

    if (!troubleshoot.isPublic) {
      return NextResponse.json(
        { message: "Troubleshoot is not public" },
        { status: 400 }
      );
    }

    // troubleshoot.isPublic = true;
    // troubleshoot.token = token;
    // await troubleshoot.save();

    // const shareableUrl = `${process.env.NEXT_PUBLIC_URL}/shared/${token}`;

    // console.log(troubleshoot, "trouble shoot returned");

    console.log(relatedQuestions, "related Question");
    console.log(troubleshoot, "troubleshoot");
    return NextResponse.json(
      { data: { questions: relatedQuestions, troubleshoot: troubleshoot } },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
