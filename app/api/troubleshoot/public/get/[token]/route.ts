import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/lib/models/Quiz";
import { getAuth } from "@clerk/nextjs/server";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { auth } from "@clerk/nextjs/server";
export async function GET(
  req: Request,

  { params }: { params: { token: string } }
) {
  const token = params.token;

  await dbConnect();

  try {
    const troubleShoot = await TroubleShoot.findOne({ token }).exec();

    if (!troubleShoot || !troubleShoot.isPublic) {
      return NextResponse.json(
        { error: "No Troubleshoot found with this URL" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: { troubleshoot: troubleShoot } },
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
