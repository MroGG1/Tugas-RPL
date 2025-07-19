const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // Titik masuk utama untuk aplikasi Anda
  entry: {
    main: "./main.js",
  },
  // Konfigurasi output
  output: {
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/images/[hash][ext][query]",
  },
  // Aturan untuk berbagai jenis file
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
  // Konfigurasi plugin
  plugins: [
    new CleanWebpackPlugin(),

    // Plugin untuk halaman utama (index.html)
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      chunks: ["main"], // Muat bundel 'main' (JS & CSS)
    }),

    // Plugin untuk halaman pemesanan (order.html)
    new HtmlWebpackPlugin({
      template: "./order.html",
      filename: "order.html",
      chunks: ["main"], // Muat bundel 'main' (JS & CSS)
    }),

    // Plugin untuk halaman login admin (admin.html)
    new HtmlWebpackPlugin({
      template: "./admin.html",
      filename: "admin.html",
      chunks: ["main"], // PERBAIKAN: Muat bundel 'main' agar CSS ikut
    }),

    // Plugin untuk halaman dashboard admin (admin-dashboard.html)
    new HtmlWebpackPlugin({
      template: "./admin-dashboard.html",
      filename: "admin-dashboard.html",
      chunks: ["main"], // PERBAIKAN: Muat bundel 'main' agar CSS ikut
    }),
  ],
};
