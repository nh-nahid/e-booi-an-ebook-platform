// Served at /.well-known/assetlinks.json (see next.config rewrites). Lets the
// Android (Trusted Web Activity) app open ebooi.bd without a browser address bar.
// Set in Vercel after PWABuilder/Play gives you the values:
//   ANDROID_PACKAGE_NAME=bd.ebooi.app
//   ANDROID_SHA256_CERT_FINGERPRINTS=AA:BB:..,CC:DD:..   (comma separated)
export const dynamic = "force-dynamic";

export function GET() {
  const pkg = process.env.ANDROID_PACKAGE_NAME;
  const prints = (process.env.ANDROID_SHA256_CERT_FINGERPRINTS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const body =
    pkg && prints.length
      ? [
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: { namespace: "android_app", package_name: pkg, sha256_cert_fingerprints: prints },
          },
        ]
      : [];

  return Response.json(body, { headers: { "Cache-Control": "public, max-age=300" } });
}
