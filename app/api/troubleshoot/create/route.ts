import dbConnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@/lib/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
export async function POST(req: NextRequest) {
  await dbConnect();
  const { userId } = getAuth(req);

  const newTroubleShoot = new TroubleShoot({
    quizList: [],
    createdBy: userId,
    title: "New",
  });
  const savedTroubleShoot = await newTroubleShoot.save();
  console.log("trouble saved to db completed");

  return NextResponse.json({ data: savedTroubleShoot }, { status: 200 });
}
