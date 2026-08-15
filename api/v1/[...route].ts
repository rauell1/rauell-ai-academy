import { handle } from "hono/vercel";
import { Hono } from "hono";
import { learningApi } from "../../src/server/api/learning";
import { operationsApi } from "../../src/server/api/operations";
import { AuthorizationError } from "../../src/server/permissions";
import { getServerEnv } from "../../src/server/env";

const app = new Hono().basePath("/api/v1");
app.use("*", async (c, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    const origin = c.req.header("origin");
    if (origin && origin !== getServerEnv().APP_ORIGIN)
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
export default handle(app);
