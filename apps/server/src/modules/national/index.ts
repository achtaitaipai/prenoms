import { Elysia } from "elysia";
import { ranking } from "./ranking";
import { stats } from "./stats";

export const national = new Elysia({ prefix: "/national" }).use(stats).use(ranking);
