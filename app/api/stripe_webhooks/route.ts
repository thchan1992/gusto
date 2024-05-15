import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Counter from "@/lib/models/Counter";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: NextRequest, res: NextResponse) {
  const payload = await req.text();
  //this is where you get the payment detail from user
  const response = JSON.parse(payload);
  const sig = req.headers.get("Stripe-Signature");
  const dateTime = new Date(response?.created * 1000).toLocaleDateString();

  const timeString = new Date(response?.created * 1000).toLocaleDateString();

  try {
    let event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("event", event.type);
    console.log("detail_user", response);

    //logic here

    await dbConnect();

    try {
      const newCounter = new Counter({ count: 11 });
      await newCounter.save(); //
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ status: "sucess", event: event.type });
  } catch (error) {
    return NextResponse.json({ status: "Failed", error });
  }
}
