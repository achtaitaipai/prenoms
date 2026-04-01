import { treaty } from "@elysiajs/eden";
import { env } from "@prenoms/env/web";
import type { App } from "@prenoms/server";

export const api = treaty<App>(env.VITE_SERVER_URL);
