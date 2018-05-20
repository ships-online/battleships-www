/* global SOCKET_URL */

import Battleships from 'battleships-core/src/game';
import Vue from 'vue';
import Game from 'battleships-ui-vue/src/game.vue';
import GameOver from 'battleships-ui-vue/src/gameover.vue';
import Settings from 'battleships-ui-vue/src/settings.vue';
import { getGameId } from './utils.js';
import isEqual from '@ckeditor/ckeditor5-utils/src/lib/lodash/isEqual';

import 'battleships-theme/src/styles/index.css';
import '../styles/main.css';

let game, gameView, gameOverView, settingsView;

// Create the game on init.
createGame( getGameId() )
	.then( game => {
		initGame( game );
		settingsView = new Vue( {
			el: '#settings',
			data: {
				onChange: handleNewSettings,
				disabled: true
			},
			render: h => h( Settings )
		} );
	} )
	.catch( error => showGameOverScreen( error ) );

function createGame( idOrSettings ) {
	if ( gameOverView ) {
		gameOverView.$destroy();
		document.querySelector( '#game' ).innerHTML = '';
		gameOverView = null;
	}

	if ( typeof idOrSettings === 'string' ) {
		return Battleships.join( SOCKET_URL, idOrSettings );
	}

	return Battleships.create( SOCKET_URL, idOrSettings );
}

function initGame( newGame ) {
	game = newGame;

	// Tmp.
	window.game = game;

	game.on( 'error', ( evt, error ) => showGameOverScreen( error ) );

	if ( game.player.isHost ) {
		updateDisabledSettings( game );

		game.on( 'change:interestedPlayersNumber', () => updateDisabledSettings( game ) );
		game.on( 'change:state', () => updateDisabledSettings( game ) );
		game.player.on( 'change:isReady', () => updateDisabledSettings( game ) );
	}

	gameView = new Vue( {
		el: '#game',
		data: { game },
		render: h => h( Game )
	} );
}

function showGameOverScreen( error ) {
	if ( gameOverView ) {
		throw new Error( 'Game over view already rendered.' );
	}

	if ( gameView ) {
		gameView.$destroy();
	}

	if ( settingsView ) {
		settingsView.$destroy();
	}

	document.querySelector( 'main' ).innerHTML = '';

	gameOverView = new Vue( {
		el: 'main',
		data: { error },
		render: h => h( GameOver )
	} );
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

function updateDisabledSettings( game ) {
	settingsView.disabled = game.status !== 'available' || game.interestedPlayersNumber > 0 || game.player.isReady;
}
