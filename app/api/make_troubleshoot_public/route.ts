import dbConnect from "@/lib/dbConnect";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  await dbConnect();
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const { troubleshootId } = await req.json();
  const token = uuidv4();

  try {
    const troubleshoot = await TroubleShoot.findById(troubleshootId).exec();

    if (!troubleshoot) {
      return NextResponse.json(
        { message: "Troubleshoot not found" },
        { status: 404 }
      );
    }

    if (troubleshoot.isPublic) {
      return NextResponse.json(
        { message: "Troubleshoot is already public" },
        { status: 400 }
      );
    }

    troubleshoot.isPublic = true;
    troubleshoot.token = token;
    await troubleshoot.save();

    const shareableUrl = `${process.env.NEXT_PUBLIC_URL}/shared/${token}`;

    return NextResponse.json({ url: shareableUrl }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
