import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth";

export const config = {
  runtime: "nodejs",
};

const nodeHandler = toNodeHandler(auth);

export default async function handler(req: any, res?: any) {
  if (!res || (typeof req.json === "function" && !req.headers?.host)) {
    return auth.handler(req);
  }
  return nodeHandler(req, res);
}
