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
    patterns: [
      { from: "../sakura/build/static/js/main.js", to: "new-ui/" },
      { from: "../sakura/build/static/js/main.js.map", to: "new-ui/" },
      { from: "../sakura/build/static/js/main.js.LICENSE.txt", to: "new-ui/" },
      { from: "../sakura/build/static/css/main.css", to: "new-ui/" },
      { from: "../sakura/build/static/css/main.css.map", to: "new-ui/" },
    ],
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
