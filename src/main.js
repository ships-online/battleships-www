import Battleships from 'battleships-core/src/game';
import NotificationView from 'battleships-ui-vanilla/src/notificationview';
import GameOverView from 'battleships-ui-vanilla/src/gameoverview';
import './main.scss';

const gameId = window.location.hash.split( '#' )[ 1 ];
const element = document.querySelector( '#game' );
const notificationWrapper = document.querySelector( '.notification-wrapper' );

let notification;

if ( !gameId ) {
	let { config } = parseParams( window.location.search.substring( 1 ) );

	config = config ? JSON.parse( decodeURI( config ) ) : {};

	Battleships.create( config.size, config.ships )
		.then( game => initGame( game ) )
		.catch( error => showGameOverScreen( error ) );
} else {
	Battleships.join( gameId )
		.then( game => initGame( game ) )
		.catch( error => showGameOverScreen( error ) );
}

function initGame( game ) {
	notification = new NotificationView( game );

	notificationWrapper.appendChild( notification.render() );
	element.appendChild( game.view.render() );

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

function parseParams( paramsString ) {
	const params = paramsString.split( '&' );

	return params.reduce( ( result, param ) => {
		param = param.split( '=' );

		result[ param[ 0 ] ] = param[ 1 ];

		return result;
	}, {} );
}
