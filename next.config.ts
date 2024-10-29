/** @type {import('next').NextConfig} */
const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
const webpack = require("webpack");

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform();
}

module.exports = {
  reactStrictMode: true,
};
