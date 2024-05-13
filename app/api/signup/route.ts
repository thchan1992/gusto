import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/lib/models/Quiz";
import { getAuth } from "@clerk/nextjs/server";
import { User } from "@/lib/models/User";
import { useUser } from "@clerk/nextjs";
import Clerk from "@clerk/clerk-js";
export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();

  const { user } = useUser();
  const { userId } = getAuth(req);

  console.log(user.primaryEmailAddress);
  if (userId) {
    try {
      const newUser = new User({
        _id: userId,
        email: user.primaryEmailAddress,
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
