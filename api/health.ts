export default function handler(req: any, res: any) {
  if (!res || (typeof req.json === "function" && !req.headers?.host)) {
    return new Response(
      JSON.stringify({ status: "ok", time: new Date().toISOString() }),
      { headers: { "content-type": "application/json" } },
    );
  }
  res.statusCode = 200;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ status: "ok", time: new Date().toISOString() }));
}
