'use strict';

const config = {
	ROOT_PATH: __dirname
};

const path = require( 'path' );
const gulp = require( 'gulp' );
const utils = require( 'battleships-dev-tools/lib/utils.js' );
const test = require( 'battleships-dev-tools/lib/tasks/test.js' )( config );
const build = require( 'battleships-dev-tools/lib/tasks/build.js' )( config );

const options = utils.parseArgs( process.argv.slice( 3 ) );

gulp.task( 'clean:build', () => utils.del( './build' ) );
gulp.task( 'build', [ 'clean:build' ], () => {
	return build( Object.assign( {
		inputPath: path.join( config.ROOT_PATH, 'src', 'main.js' ),
		outputPath: path.join( config.ROOT_PATH, 'build', 'main.js' )
	}, options ) );
} );

// JS unit tests.
gulp.task( 'test', ( done ) => {
	if ( !options.files.length || options.files.some( f => f == '*' ) ) {
		options.files = [
			'tests/**/*.js',
			'packages/battleships-core/tests/**/*.js',
			'packages/battleships-engine/tests/**/*.js',
			'packages/battleships-ui-vanilla/tests/**/*.js'
		];
	}

	test( options, done );
} );
