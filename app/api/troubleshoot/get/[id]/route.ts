import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { kv } from "@vercel/kv";
import Quiz from "@/lib/models/Quiz";
import { auth } from "@clerk/nextjs/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import rateLimitMiddleware from "@/lib/rateLimit";

export const GET = rateLimitMiddleware(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const troubleShootId = params.id;
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    await dbConnect();

    try {
      const troubleShoot = await TroubleShoot.findById(troubleShootId).exec();

      if (troubleShoot.createdBy !== userId) {
        return NextResponse.json({
          status: 401,
          message: "You do not have the access.",
        });
      }

      const relatedQuizzes = await Quiz.find({
        troubleShootId: troubleShootId,
      }).sort({ createdAt: 1 });

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
);
