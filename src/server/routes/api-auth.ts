import { Hono } from "hono";
import { auth } from "../auth";

export const config = {
  runtime: "nodejs",
};

const app = new Hono();

app.all("*", (c) => {
  return auth.handler(c.req.raw);
});

// Loaded only on the Node request/response path. Importing @hono/node-server
// replaces the global Response class, which breaks Fetch-based runtimes such
// as Cloudflare Workers (worker/index.ts calls handler(request) directly).
let listener: ((req: any, res: any) => Promise<unknown>) | undefined;
async function nodeListener() {
  if (!listener) {
    const { getRequestListener } = await import("@hono/node-server");
    listener = getRequestListener(app.fetch);
  }
  return listener;
}

export default async function handler(req: any, res?: any) {
  try {
    if (!res || (typeof req.json === "function" && !req.headers?.host)) {
      return await auth.handler(req);
    }
    if (
      req.url &&
      req.url.includes("[...all]") &&
      req.headers?.["x-matched-path"]
    ) {
      req.url = req.headers["x-matched-path"];
    }
    return await (await nodeListener())(req, res);
  } catch (error) {
    console.error("Auth API Handler Exception:", error);
    if (res && typeof res.status === "function") {
      return res
        .status(500)
        .json({
          error: "Authentication system encountered an unexpected error.",
        });
    }
    return new Response(
      JSON.stringify({
        error: "Authentication system encountered an unexpected error.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
