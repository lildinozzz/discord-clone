import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  if (!room || !username) {
    return NextResponse.json(
      { error: "Missing query parameters" },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (error) {
    // Логируем ошибки
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Error generating token" },
      { status: 500 }
    );
  }
}
