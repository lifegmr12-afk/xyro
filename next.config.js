/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "cdn.promptverse.ai", "assets.vercel.com"],
    formats: ["image/avif", "image/webp"]
  }
}

module.exports = nextConfig
