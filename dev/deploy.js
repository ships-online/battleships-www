'use strict';

/* eslint-env node */

const path = require( 'path' );
const deploy = require( 'deploy-tools/src/deploy' );

const domain = 'ships-online.com';
const dest = `domains/${ domain }/public_html`;
const tmp = `domains/${ domain }/tmp`;

const username = process.env.BATTLESHIPS_DEPLOY_USERNAME;
const host = process.env.BATTLESHIPS_DEPLOY_HOST;
const privateKey = process.env.BATTLESHIPS_DEPLOY_KEY;

deploy( {
	username,
	host,
	privateKey,
	execute( local, remote ) {
		local( 'npm run build:production' );

		let p = '';
		tmp.split( '/' ).forEach( part => {
			p = path.join( p, part );
			remote( `mkdir ${ p }`, { silent: true } );
		} );

		local( `rsync -a ${ path.join( process.cwd(), 'build', '/' ) } ${ username }@${ host }:${ tmp }` );

		remote( `rm -rf ${ dest }` );
		remote( `mv ${ tmp } ${ dest }` );
	}
} )
	.then( () => {
		console.log( 'Deployed.' );
	} )
	.catch( err => {
		console.log( err );
		process.exit( 1 );
	} );
