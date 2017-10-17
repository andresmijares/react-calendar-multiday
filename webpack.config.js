/* global __dirname, require, module */

const webpack = require('webpack')
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const env = require('yargs').argv.env // use --env with webpack 2

let libraryName = 'app'
let plugins = [
  new ExtractTextPlugin('styles.css'),
]
let outputFile

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }))
  outputFile = libraryName + '.min.js'
} else {
  outputFile = libraryName + '.js'
}

const config = {
  entry: __dirname + '/app/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      { test: /\.js?$/,
        exclude: /node_modules/,
        use: [{loader: 'babel-loader'}],
      },
      { test: /(\.css|\.scss)$/,
        loader: ExtractTextPlugin.extract({
            use: [
                'css-loader?sourceMap',
            ],
        }),
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./app')],
    extensions: ['.json', '.js'],
  },
  devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      quiet: true,
      contentBase: __dirname + '/app/sample',
  },
  externals: {
    react: 'react',
    moment: 'moment',
    'moment-range': 'moment-range',
    ramda: 'ramda',
  },
  plugins: plugins,
}

module.exports = config
