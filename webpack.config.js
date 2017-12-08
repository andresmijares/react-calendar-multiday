/* global __dirname, require, module */

const webpack = require('webpack')
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const env = require('yargs').argv.env // use --env with webpack 2

let libraryName = 'app'
let plugins = [
  // new ExtractTextPlugin('styles.css'),
]
let outputFile

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }))
  outputFile = libraryName + '.min.js'
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin(),)
  plugins.push(new HtmlWebpackPlugin({
    template: path.resolve('./app/sample/index.ejs'),
    inject: true,
  }),)
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
      { test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
  externals: [
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    },
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      moment: 'moment'
    },
    {
      'moment-range': 'moment-range'
    },
    {
      ramda: 'ramda'
    },
  ],
  plugins: plugins,
}

module.exports = config
