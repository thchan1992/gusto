import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/lib/models/Quiz";
import { getAuth } from "@clerk/nextjs/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { NextApiRequest } from "next";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { userId } = getAuth(req);
  console.log(userId, "userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const troubleShoots = await TroubleShoot.find({
      createdBy: userId,
    }).exec();
    console.log(troubleShoots, "trouble");

    return NextResponse.json({ data: troubleShoots }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching TroubleShoots:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}