import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { getAuth } from "@clerk/nextjs/server";
import { User } from "@/lib/models/User";
import { useUser } from "@clerk/nextjs";
import rateLimitMiddleware from "@/lib/rateLimit";

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  // export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();

  const { user } = useUser();
  const { userId } = getAuth(req);

  if (userId) {
    try {
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
});
