import { getRequestListener } from "@hono/node-server";

export const config = {
  runtime: "nodejs",
};

let cachedApp: any = null;
let cachedListener: any = null;

async function getAppAndListener() {
  if (cachedApp && cachedListener) {
    return { app: cachedApp, listener: cachedListener };
  }
  const { Hono } = await import("hono");
  const { learningApi } = await import("../../src/server/api/learning");
  const { operationsApi } = await import("../../src/server/api/operations");
  const { AuthorizationError } = await import("../../src/server/permissions");
  const { getServerEnv } = await import("../../src/server/env");

  const app = new Hono().basePath("/api/v1");
  app.use("*", async (c, next) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
      const origin = c.req.header("origin");
      const allowed = [
        getServerEnv().APP_ORIGIN,
        "https://learn.rauell.systems",
        "http://localhost:5173",
        "http://localhost:3000",
      ];
      if (
        origin &&
        !allowed.includes(origin) &&
        !origin.endsWith(".vercel.app") &&
        !origin.endsWith(".rauell.systems")
      )
        return c.json({ error: "Request origin is not allowed." }, 403);
    }
    await next();
  });
  app.onError((error, c) => {
    if (error instanceof AuthorizationError)
      return c.json({ error: error.message }, error.status);
    const requestId = c.req.header("x-vercel-id") || crypto.randomUUID();
    console.error("API request failed", {
      requestId,
      name: error.name,
      message: error.message,
    });
    return c.json(
      {
        error: error.message || "The request could not be completed.",
        requestId,
      },
      500,
    );
  });
  app.route("/", learningApi);
  app.route("/", operationsApi);

  const listener = getRequestListener(app.fetch);
  cachedApp = app;
  cachedListener = listener;
  return { app, listener };
}

export default async function handler(req: any, res?: any) {
  try {
    const { app, listener } = await getAppAndListener();
    if (!res || (typeof req.json === "function" && !req.headers?.host)) {
      return app.fetch(req);
    }
    return listener(req, res);
  } catch (err: any) {
    console.error("API Init/Runtime Error:", err);
    if (res && typeof res.setHeader === "function") {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          error: err.message || "Internal Server Error",
          details: err.stack,
        }),
      );
      return;
    }
    return new Response(
      JSON.stringify({
        error: err.message || "Internal Server Error",
        details: err.stack,
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}
