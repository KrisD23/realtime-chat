import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export interface AuthContext {
  roomId: string;
  token: string;
  connected: string[];
}

export async function getAuthContext(req: NextRequest): Promise<AuthContext> {
  const searchParams = req.nextUrl.searchParams;
  const roomId = searchParams.get("roomId");
  const token = req.cookies.get("x-auth-token")?.value;

  if (!roomId || !token) {
    throw new AuthError("Missing roomId or token.");
  }

  const connected = await redis.hget<string[]>(`meta:${roomId}`, "connected");

  if (!connected?.includes(token)) {
    throw new AuthError("Invalid token");
  }

  return { roomId, token, connected };
}

export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
