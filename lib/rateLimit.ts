import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map();

export default function rateLimitMiddleware(handler) {
  return async (req: NextRequest, context) => {
    console.log("Request Method:", req.method);

    if (req.method === "HEAD") {
      console.log("HEAD");
      return handler(req, context);
    }
    // const ip =
    //   req.headers.get("x-forwarded-for") ||
    //   req.ip ||
    //   req.connection.remoteAddress;

    // const ip = req.ip ?? "127.0.0.1";

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    console.log("Client IP:", ip);

    console.log("Rate Limit Middleware Invoked", { ip });
    const limit = 10;
    const windowMs = 60 * 1000;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      });
    }

    const ipData = rateLimitMap.get(ip);

    if (Date.now() - ipData.lastReset > windowMs) {
      ipData.count = 0;
      ipData.lastReset = Date.now();
    }

    console.log(ipData.count, "Count");
    console.log(limit, "Limit");

    if (ipData.count >= limit) {
      return NextResponse.json(
        { message: "Too Many Requests" },
        { status: 429 }
      );
    }

    ipData.count += 1;

    return handler(req, context);
  };
}
