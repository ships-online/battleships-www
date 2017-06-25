import Battleships from 'battleships-core/src/game';

const gameId = window.location.hash.split( '#' )[ 1 ];
const element = document.querySelector( '#game' );

function createGame() {
	Battleships.create( 10, { 1: 1 } )
		.then( game => game.renderGameToElement( element ) )
		.then( game => game.start() )
		.catch( ( error ) => showGameOverScreen( error ) );
}

function showGameOverScreen( error ) {
	const button = document.createElement( 'button' );

	button.textContent = 'New game';
	button.addEventListener( 'click', () => {
		history.pushState( '', document.title, window.location.pathname + window.location.search );
		element.innerHTML = '';
		createGame();
	} );

	element.innerHTML = 'This game is not available because: ' + error;
	element.appendChild( button );
}

if ( !gameId ) {
	createGame();
} else {
	Battleships.join( gameId )
		.then( game => game.renderGameToElement( element ) )
		.then( game => game.start() )
		.catch( error => showGameOverScreen( error ) );
}
