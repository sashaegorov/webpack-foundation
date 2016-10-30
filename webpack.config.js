const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const absolutePath = path.join(__dirname, 'build')

module.exports = {
  devtool: 'source-map',

  entry: {
    index: './src/index.js'
  },

  output: {
    filename: '[name].js',
    path: absolutePath
    // Has issues with `webpack-dev-server`
    // publicPath: assetPath
  },

  module: {
    loaders: [
      {
        include: /\.pug$/,
        loader: 'pug',
        // More:
        // https://github.com/pugjs/pug-loader#options
        query: { pretty: true }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader?presets=es2015']
      },

      // Fonts and SVG
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },

      // Foundation
      {
        test: /\.scss$/,
        exclude: [/node_modules/], // sassLoader will include node_modules explicitly
        // Using ExtractTextPlugin:
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap&outputStyle=expanded')
        // Using style-loader:
        // loaders: ['style', 'css', 'sass']
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
      filename: '../index.html',
      template: './src/index.pug',
      inject: 'body',
      xhtml: true
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),

    // TODO: Move to production settings
    new ExtractTextPlugin('styles', 'main.css')
  ],

  sassLoader: {
    includePaths: [path.resolve(__dirname, 'node_modules')]
  }
}
