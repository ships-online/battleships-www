/* global SOCKET_URL */

import Battleships from 'battleships-core/src/game';
import Vue from 'vue';
import Game from 'battleships-ui-vue/src/game.vue';
import Settings from 'battleships-ui-vue/src/settings.vue';
import { getGameId } from './utils.js';
import isEqual from '@ckeditor/ckeditor5-utils/src/lib/lodash/isEqual';

import 'battleships-theme/src/styles/style.scss';
import './main.scss';

let game, gameView;

createGame( getGameId() )
	.then( game => initGame( game ) )
	.catch( error => console.error( error ) );

function createGame( idOrSettings ) {
	if ( typeof idOrSettings === 'string' ) {
		return Battleships.join( SOCKET_URL, idOrSettings );
	}

	return Battleships.create( SOCKET_URL, idOrSettings );
}

function initGame( newGame ) {
	game = newGame;

	// tmp
	window.game = game;

	game.on( 'error', ( evt, error ) => showGameOverScreen( error ) );

	gameView = new Vue( {
		el: '#game',
		data: { game },
		render: h => h( Game )
	} );
}

function showGameOverScreen( error ) {
	console.error( error );
}

function handleNewSettings( size, shipsSchema ) {
	const battlefield = game.player.battlefield;

	if ( battlefield.size === size && isEqual( battlefield.shipsSchema, shipsSchema ) ) {
		return;
	}

	gameView.$destroy();
	document.querySelector( '.wrapper' ).innerHTML = '<div id="game" class="battleships"></div>';

	createGame( { size, shipsSchema } )
		.then( game => initGame( game ) )
		.catch( error => console.error( error ) );
}

const settings = new Vue( {
	el: '#settings',
	data: {
		isVisible: false,
		onChange: handleNewSettings
	},
	render: h => h( Settings )
} );

document.querySelector( '.settings' ).addEventListener( 'click', () => {
	settings.isVisible = !settings.isVisible;
} );
