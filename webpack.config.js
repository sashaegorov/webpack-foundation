const path = require('path')
const buildPath = path.resolve('build')
const PRODUCTION = process.env.NODE_ENV === 'production'

const WebPack3 = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  devtool: PRODUCTION ?
    'hidden-source-map' : 'cheap-module-eval-source-map',
  profile: true,
  cache: true,

  entry: {
    index: './src/index.js'
  },

  output: {
    path: buildPath,
    filename: '[name].js',
    pathinfo: !PRODUCTION
  },

  module: {
    rules: [{
        test: /\.js$/,
        // https://github.com/babel/babel-loader#troubleshooting
        exclude: /(node_modules|bower_components)/,
        loaders: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2017']
          }
        }]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules|bower_components/,
        loaders: [{
          loader: 'eslint-loader',
          options: {
            failOnWarning: true
          }
        }]
      },
      {
        // More: https://github.com/pugjs/pug-loader#options
        test: /\.pug$/,
        loaders: [{
          loader: 'pug-loader',
        }]
      },

      // Fonts and SVG
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      },

      // Sass
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: !PRODUCTION
              }
            },
            {
              loader: 'sass-loader',
              options: {
                // https://github.com/sass/node-sass
                outputStyle: PRODUCTION ? 'compressed' : 'expanded',
                sourceComments: !PRODUCTION,
                sourceMap: !PRODUCTION,
                sourceMapContents: !PRODUCTION
              }
            },
          ]

        })
      }
    ],

  },

  // eslint: {
  //
  // },

  plugins: [
    // Enable debug
    new WebPack3.LoaderOptionsPlugin({
      debug: !PRODUCTION,
      minimize: true
    }),

    // Render Pug to HTML
    new HtmlWebpackPlugin({ // Also generate a test.html
      filename: 'index.html',
      template: `!!pug-loader?pretty=${!PRODUCTION}!./src/index.pug`,
      inject: 'body',
      hash: PRODUCTION,
      xhtml: true
    }),

    // TODO: Move to production settings
    new ExtractTextPlugin('styles.css'),
    new UglifyJSPlugin({
      sourceMap: PRODUCTION,
      compress: {
        warnings: true
      }
    }),

    new CleanWebpackPlugin(
      [buildPath], {
        exclude: '.keep',
        verbose: false
      }
    ),

    new WebPack3.optimize.CommonsChunkPlugin('common.js'),
    new WebPack3.optimize.AggressiveMergingPlugin()
  ]
}
