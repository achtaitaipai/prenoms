import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { env } from "@prenoms/env/server";
import { Elysia } from "elysia";
import { national } from "./modules/national";

new Elysia()
  .use(openapi())
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
    }),
  )
  .get("/", () => "OK")
  .use(national)
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
