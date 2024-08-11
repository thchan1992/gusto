import { NextResponse, NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import dbConnect from "@/lib/dbConnect";
import { kv } from "@vercel/kv";
import Quiz from "@/lib/models/Quiz";
import { getAuth } from "@clerk/nextjs/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { auth } from "@clerk/nextjs/server";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "10s"),
});

export const config = { runtime: "edge" };
export async function GET(
  req: NextRequest,
  // res: NextResponse,
  { params }: { params: { id: string } }
) {
  const ip = req.ip ?? "127.0.0.1";
  const { limit, reset, remaining } = await ratelimit.limit(ip);
  if (remaining === 0) {
    return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }

  const troubleShootId = params.id;
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }
  await dbConnect();

  try {
    const troubleShoot = await TroubleShoot.findById(troubleShootId).exec();

    console.log(troubleShoot.createdBy, "createBy");
    console.log(userId, "user id");
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
