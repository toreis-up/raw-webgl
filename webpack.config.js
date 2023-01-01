const path = require('path')

module.exports = (env, argv) => {
  const mode = argv.mode || process.env.NODE_ENV || "development";

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = mode;
  }

  const enabledSourcemap = mode === "development";
  const useCache = mode === "development";

  return {
    mode,
    target: ["web", "es11"],
    cache: useCache,
    devtool: enabledSourcemap ? "inline-source-map": false,
    entry: {
      "main": "./src/main.ts",
    },
    output: {
      path: __dirname + '/public/js/',
      filename: "main.js",
      libraryTarget: 'umd',
      library: 'tstojstest'
    },
    module: {
      rules: [
        {
          test: /\.(mjs|js|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, "public")
      },
      host: "0.0.0.0",
      port: 3000,
    }
  }
}