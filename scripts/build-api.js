import esbuild from "esbuild";

async function build() {
  console.log("Bundling API routes with esbuild...");
  await esbuild.build({
    entryPoints: ["src/server/routes/api-v1.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
    outfile: "api/v1/[...route].js",
    packages: "external",
  });
  console.log("✓ api/v1/[...route].js bundled");

  await esbuild.build({
    entryPoints: ["src/server/routes/api-auth.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
    outfile: "api/auth/[...all].js",
    packages: "external",
  });
  console.log("✓ api/auth/[...all].js bundled");
}

build().catch((err) => {
  console.error("API build failed:", err);
  process.exit(1);
});
