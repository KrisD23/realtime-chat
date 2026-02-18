import { redis } from "@/lib/redis";
import { getAuthContext, handleAuthError } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    const ttl = await redis.ttl(`meta:${auth.roomId}`);
    return NextResponse.json({ ttl: ttl > 0 ? ttl : 0 });
  } catch (error) {
    return handleAuthError(error);
  }
}
