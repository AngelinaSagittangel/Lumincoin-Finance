const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/app.ts",
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/templates", to: "templates" },
        { from: "./src/static", to: "static" },
        { from: "./node_modules/chart.js/dist/chart.umd.js", to: "js" },
        {
          from: "./node_modules/bootstrap/dist/css/bootstrap.min.css",
          to: "css",
        },
        {
          from: "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css",
          to: "css",
        },
        {
          from: "./node_modules/bootstrap-icons/font/bootstrap-icons.json",
          to: "css",
        },
        {
          from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
          to: "js",
        },
        {
          from: "./lib/jquery-4.0.0.min.js",
          to: "js",
        },
        {
          from: "./lib/bootstrap-datepicker.min.js",
          to: "js",
        },
        {
          from: "./lib/bootstrap-datepicker.min.css",
          to: "css",
        },
        {
          from: "./lib/bootstrap-datepicker.ru.min.js",
          to: "js",
        },
        {
          from: "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff",
          to: "css/fonts",
        },
        {
          from: "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2",
          to: "css/fonts",
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
