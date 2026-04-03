import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { env } from "@prenoms/env/server";
import { Elysia } from "elysia";
import { autocomplete } from "./modules/autocomplete";
import { classement } from "./modules/classement";
import { repartition } from "./modules/repartition";
import { similarite } from "./modules/similarite";
import { statistiques } from "./modules/statistiques";

const app = new Elysia()
  .use(openapi())
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
    }),
  )
  .get("/", () => "OK")
  .use(statistiques)
  .use(classement)
  .use(repartition)
  .use(autocomplete)
  .use(similarite)
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });

export type App = typeof app;
