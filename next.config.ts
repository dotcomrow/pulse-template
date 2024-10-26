/** @type {import('next').NextConfig} */
const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
const webpack = require("webpack");

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform();
}

module.exports = {
  reactStrictMode: true,
  // compiler: {
  //   styledComponents: true,
  // },
  // publicRuntimeConfig: {
  //   // Available on both server and client
  //   theme: "DEFAULT",
  // },
  // experimental: {
  //   ppr: 'incremental',
  // },
  webpack: (config: any) => {

    config.mode = "production";
    // config.optimization = {
    //   minimize: true,
    // };
    config.performance = {
      hints: false,
    };
    // config.output = {
    //   library: {
    //     type: "module",
    //   }
    // };
    // config.module.rules.push({
    //     test: /\.([cm]?ts|tsx)$/,
    //     loader: "ts-loader",
    //   });

    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser.js",
      }),
    );
    config.experiments = {
        // outputModule: true,
        layers: true,
      // ppr: true
    };

    config.resolve.fallback = {
      stream: require.resolve("stream-browserify"),
      path: false,
      crypto: require.resolve("crypto-browserify"),
      // os: require.resolve("os-browserify/browser"),
      // zlib: require.resolve("browserify-zlib"),
      util: false,
      dns: false,
      // http: require.resolve("stream-http"),
      // https: require.resolve("https-browserify"),
      http: false,
      https: false,
      buffer: require.resolve("buffer/"),
      vm: require.resolve("vm-browserify"),
      url: require.resolve("url/"),
      // http: require.resolve("stream-http"),
      // assert: require.resolve("assert/"),
    }


    return config;
  },
};
