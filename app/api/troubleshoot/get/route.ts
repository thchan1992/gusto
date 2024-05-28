import dbConnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { TroubleShoot, ITroubleShoot } from "@/lib/models/TroubleShoot";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const troubleShoots = await (TroubleShoot.find({
      createdBy: userId,
    }).exec() as Promise<ITroubleShoot[]>);

    console.log("TroubleShoots found:", troubleShoots);

    return NextResponse.json({ data: troubleShoots }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching TroubleShoots:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
