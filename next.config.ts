import type { NextConfig } from "next";

if (!process.env.NEXT_TRACE_SPAN_THRESHOLD_MS) {
  process.env.NEXT_TRACE_SPAN_THRESHOLD_MS = "999999999";
}

const nextConfig: NextConfig = {};

export default nextConfig;
