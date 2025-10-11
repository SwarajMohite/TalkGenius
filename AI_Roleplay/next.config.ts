/** @type {import('next').NextConfig} */

const nextConfig = {
  // Add this for static export
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config: import('webpack').Configuration) => {
    // Handle the binary files
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "sharp$": false,
        "onnxruntime-node$": false,
      },
    };
    return config;
  },
  
  // Move serverComponentsExternalPackages to the root level as serverExternalPackages
  serverExternalPackages: ['@xenova/transformers'],
  
  // Keep experimental features here (but remove serverComponentsExternalPackages)
  experimental: {
    // Add other experimental features here if needed
  },
};

export default nextConfig;