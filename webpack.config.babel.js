import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

const PATHS = {
		app: path.join(__dirname, 'app'),
		build: path.join(__dirname, 'dist'),
}

export default {
		entry: [
				PATHS.app,
		],
		output: {
				path: PATHS.build,
				filename: 'bundle.js',
				publicPath: '/',
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
		stats: {
				colors: true,
				reasons: true, //if fail, show it very verbose
		},
		module: {
				rules: [
						{ test: /\.js?$/,
								exclude: /node_modules/,
								use: [{loader: 'babel-loader'}],
						},
						{ test: /\.svg$/,
								use: [{loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=font/[name].[ext]'}],
						},
						{ test: /\.woff$/,
								use: [{loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=font/[name].[ext]'}],
						},
						{ test: /\.woff2$/,
								use: [{loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=font/[name].[ext]'}],
						},
						{ test: /\.[ot]tf$/,
								use: [{loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=font/[name].[ext]'}],
						},
						{ test: /\.eot$/,
								use: [{loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=font/[name].[ext]'}],
						},
						{ test: /\.(jpe?g|png|gif)$/i,
								use: [{loader: 'file-loader?name=./app/img/[name].[ext]'}],
						},
						{ test: /\.ico$/,
								use: [{loader: 'file-loader?name=[name].[ext]'}],
						},
						{ test: /\.css$/,
								use: ['style-loader', 'css-loader'],
						},
						{ test: /\.scss$/,
								use: [
										'style-loader',
										'css-loader?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
								],
						},
						{ test: /\.ico$/,
								use: [{loader: 'file-loader?name=[name].[ext]&context=./app/'}],
						},
				],
		},
		devtool: 'cheap-module-inline-source-map',
		devServer: {
				historyApiFallback: true,
				hot: true,
				inline: true,
				quiet: true,
				contentBase: PATHS.build,
		},
		plugins: [
				new webpack.HotModuleReplacementPlugin(),
				new HtmlWebpackPlugin({
						template: path.resolve('./app/index.ejs'),
						inject: true,
				}),
		],
}
