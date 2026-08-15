import { handle } from "hono/vercel";
import { Hono } from "hono";
import { learningApi } from "../../src/server/api/learning";

const app = new Hono().basePath("/api/v1");
app.onError((error, c) => {
  const requestId = c.req.header("x-vercel-id") || crypto.randomUUID();
  console.error("API request failed", { requestId, name: error.name });
  return c.json(
    { error: "The request could not be completed.", requestId },
    500,
  );
});
app.route("/", learningApi);
export default handle(app);
