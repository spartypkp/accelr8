/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['images.unsplash.com'],
        unoptimized: true,
    },
    // Match output filenames with Vercel's default cache policy
    output: 'standalone',
};

module.exports = nextConfig; 