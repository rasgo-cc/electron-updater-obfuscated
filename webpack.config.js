// require("dotenv").config();
const package = require("./package.json");
const path = require("path");
const { merge } = require("webpack-merge");
const omit = require("lodash/omit");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");

const target = process.env.NODE_ENV || "development";
const isDev = target === "development";
const isProd = target === "production";

function srcPaths(src) {
  return path.join(__dirname, src);
}

let baseConfig = (target) => ({
  devtool: false,
  mode: process.env.NODE ? "development" : "production",
  output: { path: srcPaths("build") },
  node: { __dirname: false, __filename: false },
  optimization: {
    minimize: false
  },
  externals: [],
  resolve: {
    alias: {
      "~": srcPaths("src")
    },
    extensions: [".js", ".json", ".ts", ".tsx"]
  },
  module: {
    rules: [
      //   {
      //     test: /\.(js)$/,
      //     exclude: /node_modules/,
      //     use: [
      //       {
      //         loader: WebpackObfuscator.loader,
      //         options:
      //           target === "main"
      //             ? {
      //                 target: "node"
      //               }
      //             : {
      //                 target: "browser"
      //               }
      //       }
      //     ]
      //   }
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  }
});

let mainConfig = merge(baseConfig("main"), {
  entry: "./src/main.js",
  target: "electron-main",
  output: { filename: "main.bundle.js" },
  plugins: [
    new CopyPlugin([
      {
        from: "package.json",
        to: `package.json`,
        transform: (content) => {
          const pkg = JSON.parse(content.toString());
          return Buffer.from(
            JSON.stringify({
              ...omit(pkg, "scripts", "devDependencies", "build", "main"),
              main: "./main.bundle.js",
              scripts: { start: "electron ./main.bundle.js" },
              postinstall: "electron-builder install-app-deps"
            })
          );
        }
      },
      {
        from: "./src/dev-app-update.yml"
      }
    ])
  ]
});

let rendererConfig = merge(baseConfig("renderer"), {
  entry: "./src/renderer.js",
  target: "electron-renderer",
  output: { filename: "renderer.bundle.js" },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/assets/html/index.html")
    })
  ]
});

mainConfig = merge(mainConfig, {
  plugins: [new WebpackObfuscator({ target: "node" })]
});

rendererConfig = merge(rendererConfig, {
  plugins: [new WebpackObfuscator({ target: "browser" })]
});

module.exports = [mainConfig, rendererConfig];
