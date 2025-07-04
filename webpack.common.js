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

    new HtmlWebpackPlugin({
      template: "./admin.html", // File sumber
      filename: "admin.html", // Nama file di output/browser
      chunks: [], // Kosongkan karena script sudah ada di dalam filenya
    }),
    // Plugin untuk halaman dashboard admin
    new HtmlWebpackPlugin({
      template: "./admin-dashboard.html", // File sumber
      filename: "admin-dashboard.html", // Nama file di output/browser
      chunks: [], // Kosongkan karena script sudah ada di dalam filenya
    }),
  ],
};
