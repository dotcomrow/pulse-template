/** @type {import('next').NextConfig} */
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');
const ExternalRemotesPlugin = require("external-remotes-plugin");
const packageJson = require("./package.json");

module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  // webpack: (config, options) => {
  //   config.plugins.push(
  //     new NextFederationPlugin({
  //       name: "container",
  //       filename: "remoteEntry.js",
  //       exposes: {},
  //       remotes: {
  //         dtk: "storybook@https://dtk.suncoast.systems/remoteEntry.js",
  //       },
  //       shared: {
  //         ...packageJson.dependencies,
  //         react: {
  //           singleton: true,
  //           requiredVersion: packageJson.dependencies.react,
  //         },
  //         "react-dom": {
  //           singleton: true,
  //           requiredVersion: packageJson.dependencies["react-dom"],
  //         },
  //       },
  //       extraOptions:{
  //         automaticAsyncBoundary: true
  //       }
  //     })
  //   );
  //   // config.plugins.push(new ExternalRemotesPlugin());


  //   config.resolve.fallback = {
  //     stream: require.resolve("stream-browserify"),
  //   }


  //   return config;
  // },
};
