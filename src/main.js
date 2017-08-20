import Battleships from 'battleships-core/src/game';
import NotificationView from 'battleships-ui-vanilla/src/notificationview';
import GameOverView from 'battleships-ui-vanilla/src/gameoverview';
import './main.scss';

const gameId = window.location.hash.split( '#' )[ 1 ];
const element = document.querySelector( '#game' );
const notificationWrapper = document.querySelector( '.notification-wrapper' );

let notification;

if ( !gameId ) {
	createGame();
} else {
	Battleships.join( gameId )
		.then( game => initGame( game ) )
		.catch( error => showGameOverScreen( error ) );
}

function createGame() {
	Battleships.create()
		.then( game => initGame( game ) )
		.catch( error => showGameOverScreen( error ) );
}

function initGame( game ) {
	notification = new NotificationView( game );

	notificationWrapper.appendChild( notification.render() );
	game.renderGameToElement( element );

	return game.start();
}

function showGameOverScreen( error ) {
	if ( notification ) {
		notification.destroy();
	}

	const gameOverView = new GameOverView( {
		error: error,
		action: () => {
			window.location = window.location.pathname;
			gameOverView.destroy();
		}
	} );

	element.appendChild( gameOverView.render() );
}
