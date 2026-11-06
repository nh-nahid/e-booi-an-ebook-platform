/** @type {import('next').NextConfig} */


// The backend origin (no /api/v1). EPS callbacks must hit the registered website
// domain, so the site proxies them to the backend. Set BACKEND_ORIGIN in Vercel
// (e.g. https://your-service.onrender.com); falls back to NEXT_PUBLIC_API_URL.
const BACKEND_ORIGIN = (
  process.env.BACKEND_ORIGIN ||
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const nextConfig = {
  async headers() {
    return [
      {
        // The service worker must always be revalidated so updates reach users.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/.well-known/assetlinks.json", destination: "/assetlinks" },
      {
        source: "/api/v1/payment/eps/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/payment/eps/:path*`,
      },
    ];
  },
  images: {
    // unoptimized: true,
    // Next 16 refuses to optimize images from localhost/private IPs. Allow it
    // for local development only (production images come from public hosts).
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "e-booi.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "e-booi-an-ebook-platform-le9r.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "e-booi-an-ebook-platform.onrender.com",
        pathname: "/uploads/**",
      },
      // Cloudinary — book covers, book PDFs' cover previews, and avatars
      // are now served from here post-migration. Next.js's <Image>
      // component refuses to load any hostname not explicitly
      // whitelisted here, which is why covers stopped rendering after
      // switching to Cloudinary URLs.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Google profile pictures (users who sign in with Google keep their
      // Google avatar URL). Without this, <Image> refuses to load them.
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;