import { Message } from "./realtime";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const client = {
  room: {
    create: async () => {
      const res = await fetch(`${BASE_URL}/api/room/create`, {
        method: "POST",
      });
      return res.json() as Promise<{ roomId: string }>;
    },
    ttl: async (roomId: string) => {
      const res = await fetch(`${BASE_URL}/api/room/ttl?roomId=${roomId}`, {
        credentials: "include",
      });
      return res.json() as Promise<{ ttl: number }>;
    },
    delete: async (roomId: string) => {
      const res = await fetch(`${BASE_URL}/api/room/delete?roomId=${roomId}`, {
        method: "DELETE",
        credentials: "include",
      });
      return res.json() as Promise<{ success: boolean }>;
    },
  },
  messages: {
    get: async (roomId: string) => {
      const res = await fetch(`${BASE_URL}/api/messages?roomId=${roomId}`, {
        credentials: "include",
      });
      return res.json() as Promise<{ messages: Message[] }>;
    },
    post: async (roomId: string, sender: string, text: string) => {
      const res = await fetch(`${BASE_URL}/api/messages?roomId=${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender, text }),
        credentials: "include",
      });
      return res.json() as Promise<{
        success: boolean;
        message: Message;
      }>;
    },
  },
};
