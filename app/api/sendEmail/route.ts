import { NextResponse, NextRequest } from "next/server";
import postmark from "postmark";
import { client } from "@/postmark";
// const client = new postmark.ServerClient(
//   process.env.POSTMARK_API_TOKEN as string
// );

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { message, name, email } = res;
    await client.sendEmail({
      From: "info@windyrecipe.com",
      To: "info@windyrecipe.com",
      Subject: email + " / " + name,
      TextBody: message,
    });
    console.log(res);
    return Response.json({ res });
  } catch (e) {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
