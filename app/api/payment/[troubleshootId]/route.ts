import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { stripe } from "@/lib/stripe/stripe";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: { troubleshootId: string } }
) {
  const troubleshootId = params.troubleshootId;

  const { userId } = auth();

  const user = await clerkClient.users.getUser(userId);

  if (!userId) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",

      success_url:
        "https://troubleshush.com/" + "create_troubleshoot/" + troubleshootId,
      cancel_url:
        "https://troubleshush.com/" + "create_troubleshoot/" + troubleshootId,
      payment_method_types: ["card"],
      customer_email: user.emailAddresses[0].emailAddress,

      line_items: [
        {
          price: "price_1PkssoP9GwDHa5HlJS9B5ehn",
          quantity: 1,
        },
      ],
      metadata: { troubleshootId: troubleshootId },
      allow_promotion_codes: true,
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (e) {
    console.log(e, " payment error");
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
