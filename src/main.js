/* global SOCKET_URL */

import Battleships from 'battleships-core/src/game';
import { getGameId } from './utils.js';
import Vue from 'vue';
import Game from 'battleships-ui-vue/src/game.vue';

import 'battleships-theme/src/styles/style.scss';
import './main.scss';

let gameView;

createGame( getGameId() )
	.then( game => initGame( game ) )
	.catch( error => showGameOverScreen( error ) );

function createGame( gameId ) {
	if ( gameId ) {
		return Battleships.join( SOCKET_URL, gameId );
	}

	return Battleships.create( SOCKET_URL );
}

function initGame( game ) {
	window.game = game;

	gameView = new Vue( {
		el: '#game',
		data: { game },
		render: h => h( Game )
	} );
}

function showGameOverScreen( error ) {
	console.error( error );
	gameView.$destroy();
}
