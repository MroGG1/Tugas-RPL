const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  // Atur mode ke production
  mode: "production",

  // Source map yang dioptimalkan untuk production
  devtool: "source-map",

  // Nama file output dengan [contenthash] untuk cache busting
  output: {
    filename: "bundle.[contenthash].js",
  },

  // Plugin spesifik untuk production
  plugins: [
    // Ekstrak CSS ke dalam file terpisah
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css",
    }),
  ],

  // Aturan loader spesifik untuk production
  module: {
    rules: [
      {
        test: /\.css$/,
        // Menggunakan MiniCssExtractPlugin.loader untuk mengekstrak CSS
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  // Konfigurasi optimisasi untuk production
  optimization: {
    minimize: true, // Aktifkan minification
    minimizer: [
      new TerserPlugin(), // Minify JavaScript
      new CssMinimizerPlugin(), // Minify CSS
    ],
  },
});
