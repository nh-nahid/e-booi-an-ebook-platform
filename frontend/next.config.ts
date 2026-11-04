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
  async rewrites() {
    return [
      {
        source: "/api/v1/payment/eps/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/payment/eps/:path*`,
      },
    ];
  },
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "e-booi.com",
        pathname: "/uploads/**",
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
    ],
  },
};

module.exports = nextConfig;