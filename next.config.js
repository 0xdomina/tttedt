/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Don't precache images and fonts in development
  buildExcludes: [/chunks\/images\/.*$/, /\.(?:woff|woff2|ttf|otf)$/],
})

const nextConfig = {
  reactStrictMode: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  }
}

module.exports = withPWA(nextConfig)