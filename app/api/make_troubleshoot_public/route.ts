import { getAuth } from "@clerk/nextjs/server";
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
  const token = uuidv4(); // get a new unique token

  try {
    const troubleshoot = await TroubleShoot.findById(troubleshootId);

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

    // Make the troubleshoot public and add the token
    troubleshoot.isPublic = true;
    troubleshoot.token = token;
    await troubleshoot.save();

    // const shareableUrl = `${process.env.NEXT_PUBLIC_URL}/shared/${token}`;
    const shareableUrl = `http://localhost:3000/shared/${token}`;

    return NextResponse.json({ url: shareableUrl }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
