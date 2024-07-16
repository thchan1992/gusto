// import Stripe from "stripe";
// import { NextResponse, NextRequest } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Counter from "@/lib/models/Counter";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: NextRequest, res: NextResponse) {
//   const payload = await req.text();
//   //this is where you get the payment detail from user
//   const response = JSON.parse(payload);
//   const sig = req.headers.get("Stripe-Signature") as string;
//   // const dateTime = new Date(response?.created * 1000).toLocaleDateString();

//   // const timeString = new Date(response?.created * 1000).toLocaleDateString();

//   try {
//     let event: Stripe.Event = stripe.webhooks.constructEvent(
//       payload,
//       sig!,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );

//     console.log("event", event.type);
//     console.log("detail_user.", response);

//     //logic here

//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntentSucceeded = event.data.object;
//         // Then define and call a function to handle the event payment_intent.succeeded
//         console.log(" payment successful");
//         break;
//       // ... handle other event types
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     // await dbConnect();

//     try {
//       // const newCounter = new Counter({ count: 11 });
//       // await newCounter.save(); //
//     } catch (e) {
//       return NextResponse.json({ error: e.message }, { status: 500 });
//     }
//     return NextResponse.json({ status: "sucess", event: event.type });
//   } catch (error) {
//     return NextResponse.json({ status: "Failed", error });
//   }
// }

//----

import Stripe from "stripe";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e) {
    return new NextResponse("invalid signature", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    console.log("payment was successful");
    console.log(session);
  }

  return new NextResponse("ok", { status: 200 });
}
