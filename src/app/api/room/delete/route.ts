import { redis } from "@/lib/redis";
import { getAuthContext, handleAuthError } from "@/lib/auth";
import { realtime } from "@/lib/realtime";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);

    await realtime
      .channel(auth.roomId)
      .emit("chat.destroy", { isDestroyed: true });

    await Promise.all([
      redis.del(auth.roomId),
      redis.del(`meta:${auth.roomId}`),
      redis.del(`messages:${auth.roomId}`),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
