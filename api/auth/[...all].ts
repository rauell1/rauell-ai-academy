import { toNodeHandler } from "better-auth/node";
import { auth } from "../../src/server/auth";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res?: any) {
  if (!res || (typeof req.json === "function" && !req.headers?.host)) {
    return auth.handler(req);
  }
  return toNodeHandler(auth)(req, res);
}
