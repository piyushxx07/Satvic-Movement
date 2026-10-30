import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: {
    "/api/videos/[state]/[language]": [
      "./Videos/States/**/*.mp4",
    ],
  },
};

export default nextConfig;
