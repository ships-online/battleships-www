'use strict';

const config = {
	ROOT_PATH: __dirname
};

const path = require( 'path' );
const gulp = require( 'gulp' );
const utils = require( 'battleships-dev-tools/lib/utils.js' );
const lintTasks = require( 'battleships-dev-tools/lib/tasks/lint.js' )( config );
const testTasks = require( 'battleships-dev-tools/lib/tasks/test.js' )( config );
const compileTasks = require( 'battleships-dev-tools/lib/tasks/compile.js' )( config );

const options = utils.parseArgs( process.argv.slice( 3 ) );

gulp.task( 'clean:build', () => utils.del( './build' ) );
gulp.task( 'build', [ 'clean:build' ], () => {
	return compileTasks.build( Object.assign( {
		inputPath: path.join( config.ROOT_PATH, 'src', 'main.js' ),
		outputPath: path.join( config.ROOT_PATH, 'build', 'main.js' )
	}, options ) );
} );

gulp.task( 'lint', lintTasks.lint );
gulp.task( 'pre-commit', lintTasks.lintStaged );

// JS unit tests.
gulp.task( 'test', ( done ) => testTasks.test( options, done ) );
