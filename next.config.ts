/** @type {import('next').NextConfig} */
const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
import withPWAInit from 'next-pwa';

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform();
}

const nextConfig = {
    reactStrictMode: true,      // Enable React strict mode for improved error handling
};

export default withPWAInit({
    dest: "public",         // destination directory for the PWA files
    disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
    register: true,         // register the PWA service worker
    skipWaiting: true,      // skip waiting for service worker activation
    sw: "sw.js",    // service worker file name
    buildExcludes: ["app-build-manifest.json"],
})(nextConfig);
