const webpack = require('webpack');
const path = require('path');

const DIR_SRC = path.join(__dirname, 'src');
const DIR_DIST = path.join(__dirname, 'dist');

const webpackConfig = {
  entry: [
    path.join(DIR_SRC, 'index.js')
  ],
  output: {
    path: DIR_DIST,
    filename: 'bundle.js'
  },
  // Some modules will be added later.
  module: {
    rules: []
  },
  devServer: {
    contentBase: DIR_DIST,
    host: '0.0.0.0',
    port: 8123
  }
};


const babelConfig = {
  use: ['babel-loader'],
  test: /\.(js|jsx)$/,
  exclude: /node_modules/
};
webpackConfig.module.rules.push(babelConfig);

const cssConfig = {
  use: ['style-loader', 'css-loader'],
  test: /\.css$/,
  exclude: /node_modules/
};
webpackConfig.module.rules.push(cssConfig);

const jsonConfig = {
  use: ['json-loader'],
  test: /\.json$/,
  exclude: /node_modules/
};
webpackConfig.module.rules.push(jsonConfig);

module.exports = webpackConfig;

