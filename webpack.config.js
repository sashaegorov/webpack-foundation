let webpack = require("webpack");
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js'
  },

  devtool: 'source-map',

  output: {
    filename: '[name].js',
    path: __dirname + '/build'
  },

  module: {
    loaders: [
      {
        include: /\.pug/,
        loader: 'pug-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader?presets=es2015'],
      }
    ],

    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|bower_components/,
        loaders: ['eslint-loader']
      }
    ]
  },

  eslint: {
    failOnWarning: true
  },

  plugins: [
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'index.html',
      template: './src/index.pug',
      inject: 'body',
      xhtml: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
}
