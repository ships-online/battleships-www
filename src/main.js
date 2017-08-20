import Battleships from 'battleships-core/src/game';
import NotificationView from 'battleships-ui-vanilla/src/notificationview';
import './main.scss';

const gameId = window.location.hash.split( '#' )[ 1 ];
const element = document.querySelector( '#game' );
const notificationWrapper = document.querySelector( '.notification-wrapper' );

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
	const notification = new NotificationView( game );

	notificationWrapper.appendChild( notification.render() );
	game.renderGameToElement( element );

	return game.start();
}

function showGameOverScreen( error ) {
	const button = document.createElement( 'button' );

	button.textContent = 'New game';
	button.addEventListener( 'click', () => {
		history.pushState( '', document.title, window.location.pathname + window.location.search );
		element.innerHTML = '';
		createGame();
	} );

	notificationWrapper.innerHTML = '';
	element.innerHTML = 'This game is not available because: ' + error;
	element.appendChild( button );
}
