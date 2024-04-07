import { Redis } from "@upstash/redis";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";
import type { EnvConfig } from "types/env";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/search", async (context) => {
  try {
    const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
      env<EnvConfig>(context);

    const start = performance.now();

    const redis = new Redis({
      token: UPSTASH_REDIS_REST_TOKEN,
      url: UPSTASH_REDIS_REST_URL,
    });

    const queryParam = context.req.query("q");

    if (!queryParam) {
      return context.json({ message: "Invalid search query" }, { status: 400 });
    }

    const response = [];
    const rank = await redis.zrank("terms", queryParam);

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 100);
      for (const element of temp) {
        if (!element.startsWith(queryParam)) {
          break;
        }

        if (element.endsWith("*")) {
          response.push(element.substring(0, element.length - 1));
        }
      }
    }

    const end = performance.now();

    return context.json({
      results: response,
      duration: end - start,
    });
  } catch (error) {
    console.error(error);
    return context.json(
      { results: [], message: "Internal server error" },
      { status: 500 },
    );
  }
});

export const GET = handle(app);
export default app as never;
