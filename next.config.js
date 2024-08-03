/** @type {import('next').NextConfig} */
const TerserPlugin = require("terser-webpack-plugin");

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  swcMinify: true,
};

module.exports = nextConfig;
