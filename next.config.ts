import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['images.unsplash.com'],
		unoptimized: true,
	},
	// Match output filenames with Vercel's default cache policy
	output: 'standalone',
};

export default nextConfig;
