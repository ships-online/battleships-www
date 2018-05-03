/* global SOCKET_URL */

import Battleships from 'battleships-core/src/game';
import { getGameId } from './utils.js';
import { createGameView } from 'battleships-ui-vue/src/utils.js';

import 'battleships-theme-wireframe/src/styles/style.scss';
import './main.scss';

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
	createGameView( game );
}

function showGameOverScreen( error ) {
	console.error( error );
}
