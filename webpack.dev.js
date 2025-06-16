const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  // Atur mode ke development
  mode: "development",

  // Source map untuk debugging yang lebih mudah
  devtool: "eval-source-map",

  // Nama file output untuk development
  output: {
    filename: "bundle.js",
  },

  // Pengaturan untuk webpack-dev-server
  devServer: {
    static: {
      directory: "./dist",
    },
    compress: true,
    port: 9001,
    open: true,
    hot: true, // Mengaktifkan Hot Module Replacement (HMR)
  },

  // Aturan loader spesifik untuk development
  module: {
    rules: [
      {
        test: /\.css$/,
        // style-loader lebih cepat untuk development karena inject CSS via JS
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});
