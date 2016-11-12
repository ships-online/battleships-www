'use strict';

const config = {
	ROOT_PATH: __dirname
};

const gulp = require( 'gulp' );

const utils = require( 'battleships-dev-tools/lib/utils.js' );
const linkTasks = require( 'battleships-dev-tools/lib/tasks/relink.js' )( config );
const lintTasks = require( 'battleships-dev-tools/lib/tasks/lint.js' )( config );
const testTasks = require( 'battleships-dev-tools/lib/tasks/test.js' )( config );
const compileTasks = require( 'battleships-dev-tools/lib/tasks/compile.js' )( config );

const options = utils.parseArgs( process.argv.slice( 3 ) );

gulp.task( 'relink', linkTasks.relink );

// Compile engine to esnext format.
gulp.task( 'clean:battleships', () => utils.del( './lib/battleships' ) );
gulp.task( 'battleships:compile', [ 'clean:battleships' ], () => compileTasks.compileGame( 'lib/battleships/Battleships.js', options ) );

gulp.task( 'lint', lintTasks.lint );
gulp.task( 'pre-commit', lintTasks.lintStaged );

// JS unit tests.
gulp.task( 'test', ( done ) => testTasks.test( options, done ) );
