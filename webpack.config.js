const path = require('path');
const pkg = require('./package.json');

const libraryName = pkg.name;

const config = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `${libraryName}.min.js`,
    library: {
      name: libraryName,
      type: 'umd',
      // expose the default export directly so consumers get `obyte.Client`
      // (not `obyte.default.Client`) in the browser, matching the node build
      export: 'default',
      umdNamedDefine: true,
    },
    globalObject: 'this',
  },
  resolve: {
    alias: {
      // swap the native secp256k1 (elliptic + bn.js, ~200 KiB in the browser) for the
      // pure-JS @noble/curves implementation; Node keeps the native module
      secp256k1$: path.resolve(__dirname, 'src/secp256k1-browser.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
