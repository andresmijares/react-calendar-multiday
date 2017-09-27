import webpack from 'webpack'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackMd5Hash from 'webpack-md5-hash'
import ManifestPlugin from 'webpack-manifest-plugin'
import InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import path from 'path'

const enviroment = (process.argv[process.argv.length - 1])
const basePath = '/'

export default {
		entry: {
				vendor: [
						'react', 'redux', 'ramda',
						'react-dom', 'react-redux', 'react-router',
					],
				app: path.resolve(__dirname, 'app/index.js'),
		},
		output: {
				path: path.resolve(__dirname, 'build'),
				filename: '[name].[chunkhash].js',
				publicPath: basePath,
		},
		resolve: {
				alias: {
						helpers: path.resolve(__dirname, 'app/helpers/'),
						services: path.resolve(__dirname, 'app/services/'),
						components: path.resolve(__dirname, 'app/components/'),
						containers: path.resolve(__dirname, 'app/containers/'),
						generics: path.resolve(__dirname, 'app/generics/'),
						data: path.resolve(__dirname, 'app/data/'),
				},
		},
		devtool: 'source-map',
		target: 'web',
		module: {
				rules: [
						{ test: /\.js?$/,
								exclude: /node_modules/,
								use: [{loader: 'babel-loader'}],
						},
						{ test: /\.svg$/,
								use: [{loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=app/sharedStyles/[name].[ext]'}],
						},
						{ test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
								use: [{loader: 'file-loader?name=[name].[ext]'}],
						},
						{ test: /\.(jpe?g|png|gif)$/i,
								use: [{loader: 'file-loader?name=[name].[ext]'}],
						},
						{ test: /\.ico$/, loader: 'file-loader?name=[name].[ext]' },
						{ test: /(\.css|\.scss)$/,
								loader: ExtractTextPlugin.extract({
										use: [
												'css-loader?sourceMap',
										],
								}),
						},
				],
		},
		// postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
		plugins: [
				new webpack.optimize.CommonsChunkPlugin({
						name: 'vendor',
						minChunks: Infinity,
				}),

				new WebpackMd5Hash(),
				new ExtractTextPlugin({
						filename: '[name].[contenthash].css',
						allChunks: true,
				}),
				new webpack.DefinePlugin({
						'process.env': {
								NODE_ENV: JSON.stringify('production'),
						},
				}),
				// Minify JS
				new UglifyJSPlugin({
						sourceMap: true,
				}),
				new CompressionPlugin({
						asset: '[path].gz[query]',
						algorithm: 'gzip',
						test: /\.(js|html|css)$/,
						threshold: 10240,
						minRatio: 0.8,
				}),

				// Creates a manifest
				new ManifestPlugin(),
				new InlineManifestWebpackPlugin({
						name: 'webpackManifest',
				}),
				// source map
				new webpack.SourceMapDevToolPlugin({
						filename: '[name].js.map',
						exclude: ['vendor.js'],
				}),
				new HtmlWebPackPlugin({
						template: './app/index.ejs',
						minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true,
						},
						inject: true,
				}),

		],
}
