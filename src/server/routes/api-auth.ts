import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth";

export const config = {
  runtime: "nodejs",
};

const nodeHandler = toNodeHandler(auth);

export default async function handler(req: any, res?: any) {
  try {
    if (!res || (typeof req.json === "function" && !req.headers?.host)) {
      return await auth.handler(req);
    }
    return await nodeHandler(req, res);
  } catch (error) {
    console.error("Auth API Handler Exception:", error);
    if (res && typeof res.status === "function") {
      return res.status(500).json({ error: "Authentication system encountered an unexpected error." });
    }
    return new Response(
      JSON.stringify({ error: "Authentication system encountered an unexpected error." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
