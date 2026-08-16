import { Hono } from "hono";
import { learningApi } from "../../src/server/api/learning";
import { operationsApi } from "../../src/server/api/operations";
import { AuthorizationError } from "../../src/server/permissions";
import { getServerEnv } from "../../src/server/env";

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
  console.error("API request failed", { requestId, name: error.name });
  return c.json(
    { error: "The request could not be completed.", requestId },
    500,
  );
});
app.route("/", learningApi);
app.route("/", operationsApi);

export default async function handler(req: any, res?: any) {
  // If Edge runtime / Web Fetch API: req is a Web Request
  if (!res || (typeof req.json === "function" && !req.headers?.host)) {
    return app.fetch(req);
  }

  // Node.js Serverless runtime: req is IncomingMessage, res is ServerResponse
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host =
      req.headers["x-forwarded-host"] ||
      req.headers.host ||
      "learn.rauell.systems";
    const url = `${protocol}://${host}${req.url}`;

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val === undefined) continue;
      if (Array.isArray(val)) {
        val.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, String(val));
      }
    }

    let body: any = null;
    if (!["GET", "HEAD"].includes(req.method || "")) {
      if (req.body) {
        body =
          typeof req.body === "string" || Buffer.isBuffer(req.body)
            ? req.body
            : JSON.stringify(req.body);
      }
    }

    const webReq = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    const webRes = await app.fetch(webReq);

    res.statusCode = webRes.status;
    webRes.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    if (!webRes.body) {
      return res.end();
    }

    const arrayBuffer = await webRes.arrayBuffer();
    return res.end(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error("Vercel Serverless API Error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          error: err.message || "The server encountered an error.",
        }),
      );
    }
  }
}
