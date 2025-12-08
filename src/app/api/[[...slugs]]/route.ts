import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api" }).get("/user", {
  user: { name: "kd" },
});

export const GET = app.fetch;
export const POST = app.fetch;
