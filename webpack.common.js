const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: "./main.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/images/[hash][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Plugin untuk halaman utama
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      chunks: ["main"],
    }),
    // Plugin untuk halaman pemesanan
    new HtmlWebpackPlugin({
      template: "./order.html",
      filename: "order.html",
      chunks: ["main"],
    }),
  ],
};
