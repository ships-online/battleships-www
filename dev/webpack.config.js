'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const BabiliPlugin = require( 'babel-minify-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = options => {
	const webpackConfig = {
		resolve: {
			modules: [ 'packages', process.cwd(), 'node_modules' ]
		},

		entry: './src/scripts/main.js',

		output: {
			path: path.resolve( process.cwd(), 'build' ),
			publicPath: './',
			filename: '[hash].main.js',
			library: 'battleships',
			libraryTarget: 'umd',
			umdNamedDefine: true
		},

		watch: options.watch,

		plugins: [
			new webpack.DefinePlugin( options.environment ),
			new ExtractTextPlugin( '[hash].app.css' ),
			new HtmlWebpackPlugin( {
				template: './src/index.html',
				socketUrl: options[ 'socket-url' ]
			} )
		],

		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: file => (
						/(node_modules\/((?!ckeditor|battleships)[a-z-]+))/.test( file ) &&
						!/\.vue\.js/.test( file )
					),
					loader: 'babel-loader',
					query: {
						cacheDirectory: true,
						plugins: [ require( 'babel-plugin-transform-es2015-modules-commonjs' ) ]
					}
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.scss$/,
					use: ExtractTextPlugin.extract( {
						publicPath: './',
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: options.minify
								}
							},
							{
								loader: 'sass-loader'
							}
						]
					} )
				},
				{
					test: /.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
					use: 'file-loader?name=[name]-[hash:6].[ext]'
				},
				{
					test: /\.html$/,
					exclude: /index\.html$/,
					use: {
						loader: 'html-loader',
						options: {
							interpolate: true
						}
					}
				}
			]
		}
	};

	if ( options.sourceMap ) {
		webpackConfig.devtool = 'inline-source-map';
	}

	if ( options.minify ) {
		webpackConfig.plugins = [
			...webpackConfig.plugins,
			new webpack.DefinePlugin( {
				'process.env': {
					'NODE_ENV': JSON.stringify( 'production' )
				}
			} ),
			new BabiliPlugin( null, { comments: false } ),
			new webpack.optimize.ModuleConcatenationPlugin()
		];
	}

	return webpackConfig;
};
