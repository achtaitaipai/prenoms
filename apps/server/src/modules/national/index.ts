import { Elysia } from "elysia";
import { stats } from "./stats";

export const national = new Elysia({ prefix: "/national" }).use(stats);
