'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const BabiliPlugin = require( 'babel-minify-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

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
			new HtmlWebpackPlugin( {
				template: './src/index.html',
				socketUrl: options[ 'socket-url' ]
			} ),
			new CopyWebpackPlugin( [
				{ from: './robots.txt', to: './robots.txt' }
			] )
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
					loader: 'vue-loader',
					options: {
						postcss: getPostCssPlugins( options )
					}
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: 'vue-style-loader',
						},
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: getPostCssPlugins( options )
							}
						}
					]
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

function getPostCssPlugins( options ) {
	return [
		require( 'postcss-import' )(),
		require( 'postcss-nested' )(),
		...( options.minify ? [ require( 'cssnano' )() ] : [] )
	];
}
