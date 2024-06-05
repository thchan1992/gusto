import dbConnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@/lib/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";

import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const { userId } = auth();

  const { title } = data;

  if (!userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const newTroubleShoot = new TroubleShoot({
    quizList: [],
    createdBy: userId,
    title: title,
  });
  const savedTroubleShoot = await newTroubleShoot.save();
  console.log("trouble saved to db completed");

  return NextResponse.json({ data: savedTroubleShoot }, { status: 200 });
}
