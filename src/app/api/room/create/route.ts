import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const ROOM_TTL_SECONDS = 60 * 10;

export async function POST() {
  try {
    const roomId = nanoid();

    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS);

    return NextResponse.json({ roomId });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}
