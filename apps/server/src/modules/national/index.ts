import { Elysia } from "elysia";
import { ranking } from "./ranking";
import { repartition } from "./repartition";
import { stats } from "./stats";

export const national = new Elysia({ prefix: "/national" })
  .use(stats)
  .use(ranking)
  .use(repartition);
