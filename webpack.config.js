module.exports = {
  mode: "development",

  entry: {
    main: "./src/web/main.ts",
  },

  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    path: __dirname + "/dist/web",
    publicPath: "/assets/",
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: { configFile: "tsconfig.web.json" },
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
    usedExports: true,
  },
};
