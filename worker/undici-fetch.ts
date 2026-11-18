/**
 * Stand-in for the `undici` package (wrangler.jsonc "alias").
 *
 * @vercel/blob, still used to delete files uploaded before the move to object
 * storage, imports `fetch` from undici. undici's HTTP client compiles
 * WebAssembly on its first request, which Cloudflare Workers forbid, so the
 * platform fetch is used instead.
 */
export const fetch: typeof globalThis.fetch = (...args) => globalThis.fetch(...args);
