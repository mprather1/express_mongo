const webpack = require('webpack');
const path = require("path");

module.exports = {
  entry: path.join(__dirname, 'app', 'main.js'),
  output: {
    path: path.join(__dirname, 'app', 'public', 'js'),
    filename: 'bundle.js'
  },
  module: {
    postLoaders: [
     {
       test: /\.js$/,
       include: __dirname + '/app',
       exclude: [/node_modules/, __dirname + 'app/public'],
       loader: 'jshint-loader'
      }
   ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: true,
      sourcemap: false,
      beautify: false,
      dead_code: true
    })
  ]
};