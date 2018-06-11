'use strict';

/* eslint-env node */

const webpack = require( 'webpack' );
const minimist = require( 'minimist' );
const getWebpackConfig = require( './webpack.config' );

const options = minimist( process.argv.slice( 2 ), {
	string: [
		'socket-url',
		'analytics'
	],

	boolean: [
		'watch',
		'source-map',
		'minify'
	],

	alias: {
		w: 'watch',
		s: 'source-map',
		m: 'minify'
	},

	default: {
		watch: false,
		coverage: false,
		minify: false,
		analytics: '',
		'source-map': false,
		'socket-url': 'localhost:8080'
	}
} );

options.sourceMap = options[ 'source-map' ];

options.environment = {
	SOCKET_URL: JSON.stringify( options[ 'socket-url' ] ),
	ANALYTICS: JSON.stringify( options.analytics ),
};

function buildWebpack() {
	return new Promise( ( resolve, reject ) => {
		webpack( getWebpackConfig( options ), ( err, stats ) => {
			if ( err ) {
				return reject( err );
			}

			console.log( stats.toString( {
				colors: true
			} ) );

			resolve();
		} );
	} );
}

buildWebpack();
