import dbConnect from "@/lib/dbConnect";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/lib/models/Quiz";
import rateLimitMiddleware from "@/lib/rateLimit";

export const GET = rateLimitMiddleware(
  async (req: NextRequest, { params }: { params: { token: string } }) => {
    console.log("shared");
    // export async function GET(
    //   req: Request,
    //   { params }: { params: { token: string } }
    // ) {
    await dbConnect();

    const token = params.token;
    // const { token } = await req.json();

    try {
      const troubleshoot = await TroubleShoot.findOne({ token: token }).exec();
      const relatedQuestions = await Quiz.find({
        troubleShootId: troubleshoot._id,
      }).sort({ createdAt: 1 });

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

      return NextResponse.json(
        { data: { questions: relatedQuestions, troubleshoot: troubleshoot } },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  },
  10
);
