export const config = {
  runtime: "nodejs",
};

let cachedAuth: any = null;
let cachedNodeHandler: any = null;

async function getAuthAndHandler() {
  if (cachedAuth && cachedNodeHandler) {
    return { auth: cachedAuth, nodeHandler: cachedNodeHandler };
  }
  const { toNodeHandler } = await import("better-auth/node");
  const { auth } = await import("../../src/server/auth");
  const nodeHandler = toNodeHandler(auth);
  cachedAuth = auth;
  cachedNodeHandler = nodeHandler;
  return { auth, nodeHandler };
}

export default async function handler(req: any, res?: any) {
  try {
    const { auth, nodeHandler } = await getAuthAndHandler();
    if (!res || (typeof req.json === "function" && !req.headers?.host)) {
      return auth.handler(req);
    }
    return nodeHandler(req, res);
  } catch (err: any) {
    console.error("Auth Init/Runtime Error:", err);
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
