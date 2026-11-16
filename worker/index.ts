/**
 * Cloudflare Worker entry point.
 *
 * Serves the Vite build from static assets (with the SPA fallback configured in
 * wrangler.jsonc) and runs the Hono API handlers that Vercel used to run as
 * serverless functions. Both handlers already accept a Fetch API Request.
 */
import apiV1 from "../src/server/routes/api-v1";
import apiAuth from "../src/server/routes/api-auth";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/api/v1/") || pathname === "/api/v1")
      return apiV1(request) as Promise<Response>;
    if (pathname.startsWith("/api/auth/"))
      return apiAuth(request) as Promise<Response>;
    if (pathname.startsWith("/api/"))
      return Response.json(
        { error: "Not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    return env.ASSETS.fetch(request);
  },
};
