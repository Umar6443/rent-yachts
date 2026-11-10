import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/rent-yachts",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
