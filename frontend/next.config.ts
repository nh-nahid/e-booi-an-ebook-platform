/** @type {import('next').NextConfig} */


const nextConfig = {
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