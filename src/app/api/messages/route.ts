import { redis } from "@/lib/redis";
import { getAuthContext, handleAuthError } from "@/lib/auth";
import { Message, realtime } from "@/lib/realtime";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageBodySchema = z.object({
  sender: z.string().max(100),
  text: z.string().max(1000),
});

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    const body = await req.json();

    // Validate request body
    const validatedBody = messageBodySchema.parse(body);
    const { sender, text } = validatedBody;
    const { roomId } = auth;

    const roomExists = await redis.exists(`meta:${roomId}`);

    if (!roomExists) {
      return NextResponse.json(
        { error: "Room does not exist" },
        { status: 404 },
      );
    }

    const message: Message = {
      id: nanoid(),
      sender,
      text,
      timestamp: Date.now(),
      roomId,
    };

    // add message to history
    await redis.rpush(`messages:${roomId}`, {
      ...message,
      token: auth.token,
    });
    await realtime.channel(roomId).emit("chat.message", message);

    // housekeeping
    const remaining = await redis.ttl(`meta:${roomId}`);

    await redis.expire(`messages:${roomId}`, remaining);
    await redis.expire(`history:${roomId}`, remaining);
    await redis.expire(roomId, remaining);

    return NextResponse.json({ success: true, message });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 },
      );
    }
    return handleAuthError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);

    const messages = await redis.lrange<Message & { token?: string }>(
      `messages:${auth.roomId}`,
      0,
      -1,
    );

    return NextResponse.json({
      messages: messages.map((m) => ({
        ...m,
        token: m.token === auth.token ? auth.token : undefined,
      })),
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
