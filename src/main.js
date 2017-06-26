import Battleships from 'battleships-core/src/game';
import createNotification from 'battleships-core/src/helpers/createnotification';

import './main.scss';

const gameId = window.location.hash.split( '#' )[ 1 ];
const element = document.querySelector( '#game' );
const notificationWrapper = document.querySelector( '.notification-wrapper' );

function createGame() {
	Battleships.create()
		.then( game => {
			game.renderGameToElement( element );
			notificationWrapper.appendChild( createNotification( game ) );

			return game;
		} )
		.then( game => game.start() )
		.catch( ( error ) => showGameOverScreen( error ) );
}

function showGameOverScreen( error ) {
	const button = document.createElement( 'button' );

	button.textContent = 'New game';
	button.addEventListener( 'click', () => {
		history.pushState( '', document.title, window.location.pathname + window.location.search );
		element.innerHTML = '';
		notificationWrapper.innerHTML = '';
		createGame();
	} );

	element.innerHTML = 'This game is not available because: ' + error;
	element.appendChild( button );
}

if ( !gameId ) {
	createGame();
} else {
	Battleships.join( gameId )
		.then( game => {
			game.renderGameToElement( element );
			notificationWrapper.appendChild( createNotification( game ) );

			return game;
		} )
		.then( game => game.start() )
		.catch( error => showGameOverScreen( error ) );
}
