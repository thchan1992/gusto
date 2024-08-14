import { NextResponse, NextRequest } from "next/server";

import { client } from "@/postmark";
import rateLimitMiddleware from "@/lib/rateLimit";
// const client = new postmark.ServerClient(
//   process.env.POSTMARK_API_TOKEN as string
// );

export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  // export async function POST(request: NextRequest) {
  try {
    const res = await req.json();
    const { message, name, email } = res;
    await client.sendEmail({
      From: "info@windyrecipe.com",
      To: "info@windyrecipe.com",
      Subject: email + " / " + name,
      TextBody: message,
    });
    return Response.json({ res });
  } catch (e) {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}, 1);
