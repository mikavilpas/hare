const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const moduleDefinitions = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
    {
      test: /\.(gif|png|jpe?g|svg|xml)$/i,
      use: "file-loader",
    },
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, "css-loader"],
    },
  ],
};

const plugins = [
  new MiniCssExtractPlugin(),
  new OptimizeCssAssetsPlugin({
    // assetNameRegExp: /\.optimize\.css$/g,
    cssProcessor: require("cssnano"),
    cssProcessorPluginOptions: {
      preset: ["default", { discardComments: { removeAll: true } }],
    },
    canPrint: true,
  }),
  new CopyPlugin({
    patterns: [{ from: "../sakura/build/static/", to: "static/" }],
    patterns: [{ from: "../sakura/public", to: "static/public/" }],
  }),
];

module.exports = [
  {
    name: "devsite",
    mode: "production",
    devtool: false,
    entry: {
      highlighter: "./src/highlighter.js",
      index: "./src/index.js",
    },
    module: moduleDefinitions,
    plugins: plugins,
  },
  {
    name: "installToHostSite",
    mode: "production",
    devtool: false,
    entry: {
      installToHostSite: "./src/installToHostSite.js",
    },
    module: moduleDefinitions,
  },
  {
    name: "loader",
    mode: "production",
    devtool: false,
    entry: {
      loader: "./src/loader/loader.js",
    },
    module: moduleDefinitions,
  },

  {
    name: "scriptfiles",
    mode: "production",
    devtool: false,
    entry: {
      prod: "./src/prod.js",
    },
    module: moduleDefinitions,
    plugins: plugins,
    performance: {
      maxEntrypointSize: 900000,
      maxAssetSize: 900000,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
            cache: false,
          },
        }),
      ],
    },
  },
];
