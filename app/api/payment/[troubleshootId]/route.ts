import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: { troubleshootId: string } }
) {
  const troubleshootId = params.troubleshootId;
  console.log(troubleshootId, "id");
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: "http://localhost:3000/",
      cancel_url: "http://localhost:3000/",
      payment_method_types: ["card"],
      customer_email: "example@example.com",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "My product",
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      metadata: { troubleshootId: troubleshootId },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}