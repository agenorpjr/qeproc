import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.externals = [...config.externals, "bcrypt"];
        return config;
      },
};

export default nextConfig;
