/** @type {import('next').NextConfig} */
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ExternalRemotesPlugin = require("external-remotes-plugin");
const packageJson = require("./package.json");

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
  webpack: (config, options) => {
    config.plugins.push(
      new ModuleFederationPlugin({
        name: "container",
        filename: "remoteEntry.js",
        exposes: {},
        remotes: {
          dtk: "storybook@https://dtk.suncoast.systems/remoteEntry.js",
        },
        shared: {
          ...packageJson.dependencies,
          react: {
            singleton: true,
            requiredVersion: packageJson.dependencies.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: packageJson.dependencies["react-dom"],
          },
        },
      })
    );
    config.plugins.push(new ExternalRemotesPlugin());


    config.resolve.fallback = {
      stream: require.resolve("stream-browserify"),
    }


    return config;
  },
};

module.exports = nextConfig;
