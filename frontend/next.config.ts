/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "e-booi-an-ebook-platform.onrender.com",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;