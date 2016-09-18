let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js'
  },

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
    ]
  },

  plugins: [
      new HtmlWebpackPlugin({  // Also generate a test.html
        filename: 'index.html',
        template: './src/index.pug',
        inject: 'body',
        xhtml: true
      })
    ]
}
