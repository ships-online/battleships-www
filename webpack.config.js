'use strict';
/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const minimist = require( 'minimist' );

const options = minimist( process.argv.slice( 2 ), {
	string: [
		'socket-url'
	],

	boolean: [
		'watch',
		'source-map'
	],

	alias: {
		w: 'watch',
		s: 'source-map'
	},

	default: {
		watch: false,
		coverage: false,
		'source-map': false,
		'socket-url': 'localhost:8080'
	}
} );

options.sourceMap = options[ 'source-map' ];

options.environment = {
	SOCKET_URL: JSON.stringify( options[ 'socket-url' ] )
};

const webpackConfig = {
	resolve: {
		modules: [ 'packages', process.cwd(), 'node_modules' ]
	},

	entry: './src/main.js',

	output: {
		path: path.resolve( __dirname, 'build' ),
		publicPath: path.join( '.', 'build' ) + path.sep,
		filename: 'main.js',
		library: 'battleships',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},

	watch: options.watch,

	plugins: [
		new webpack.DefinePlugin( options.environment )
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
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.svg$/,
				use: [
					'file-loader'
				]
			}
		]
	},
};

if ( options.sourceMap ) {
	webpackConfig.devtool = 'inline-source-map';
}

module.exports = webpackConfig;
