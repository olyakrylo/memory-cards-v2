/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require("path");

const conflictPackages = [
  "@babel/runtime",
  "@emotion/cache",
  "@mui/private-theming",
  "@mui/styled-engine",
  "@mui/system",
  "@mui/utils",
  "@mui/base",
  "react-is",
  "@popperjs/core",
  "bn.js",
];

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(new DuplicatePackageCheckerPlugin());
    conflictPackages.forEach((pack) => {
      config.resolve.alias[pack] = path.resolve(
        __dirname,
        "node_modules",
        pack
      );
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth",
        permanent: true,
      },
    ];
  },
});
