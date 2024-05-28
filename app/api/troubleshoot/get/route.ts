import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/lib/models/Quiz";
import { getAuth } from "@clerk/nextjs/server";
import { ITroubleShoot, TroubleShoot } from "@/lib/models/TroubleShoot";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const troubleShoots: ITroubleShoot[] = (await TroubleShoot.find({
      createdBy: userId,
    }).exec()) as ITroubleShoot[];

    return NextResponse.json({ data: troubleShoots }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching TroubleShoots:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
