// https://github.com/facebook/create-react-app/issues/5306#issuecomment-695173195
// craco.config.js
module.exports = {
  webpack: {
    configure: {
      output: {
        filename: "static/js/[name].js",
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: {
          chunks(chunk) {
            return false;
          },
        },
      },
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.plugins[5].options.filename = "static/css/[name].css";
          return webpackConfig;
        },
      },
      options: {},
    },
  ],
};
