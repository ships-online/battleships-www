import Battleships from 'battleships-core/src/game';
import Vue from 'vue';
import Game from 'battleships-ui-vue/src/game.vue';
import GameOver from 'battleships-ui-vue/src/gameover.vue';
import { settings } from 'battleships-ui-vue/src/utils';
import isEqual from '@ckeditor/ckeditor5-utils/src/lib/lodash/isEqual';

export function start( socketUrl, mainEl, idOrSettings ) {
	let game, gameView, gameOverView;

	// Create the game on init.
	createGame( idOrSettings )
		.then( game => {
			initGame( game );
			document.body.classList.add( 'ready' );
		} )
		.catch( error => showGameOverScreen( error ) );

	function createGame( idOrSettings ) {
		if ( typeof idOrSettings === 'string' ) {
			return Battleships.join( socketUrl, idOrSettings );
		}

		return Battleships.create( socketUrl, idOrSettings );
	}

	function initGame( newGame ) {
		game = newGame;

		setTitleMessage( 'Battleships' );

		game.on( 'change:activePlayerId', () => {
			if ( game.activePlayerId ) {
				setTitleMessage( game.activePlayerId === game.player.id ? 'Take a shoot' : 'Wait for the opponent shoot' );
			} else if ( game.winnerId ) {
				setTitleMessage( game.winnerId === game.player.id ? 'You won :)' : 'You lost :(' );
			}
		} );

		game.on( 'change:status', () => {
			if ( game.status !== 'battle' && game.status !== 'over' ) {
				setTitleMessage( 'Battleships' );
			}
		} );

		game.on( 'error', ( evt, error ) => showGameOverScreen( error ) );

		gameView = new Vue( {
			el: '#game',
			data: {
				game,
				onSettingsChange: handleNewSettings
			},
			render: h => h( Game )
		} );
	}

	function showGameOverScreen( error ) {
		console.error( error );

		if ( gameOverView ) {
			throw new Error( 'Game over view already rendered.' );
		}

		if ( gameView ) {
			gameView.$destroy();
		}

		setTitleMessage( 'Game over' );

		mainEl.innerHTML = '';

		gameOverView = new Vue( {
			el: 'main',
			data: { error },
			render: h => h( GameOver )
		} );
	}

	function handleNewSettings( { size, shipsSchema } ) {
		const battlefield = game.player.battlefield;

		if ( battlefield.size === size && isEqual( battlefield.shipsSchema, shipsSchema ) ) {
			return;
		}

		settings.set( 'gameSettings', { size, shipsSchema } );

		game.destroy();
		gameView.$destroy();
		mainEl.querySelector( '.wrapper' ).innerHTML = '<div id="game" class="battleships"></div>';

		createGame( { size, shipsSchema } )
			.then( game => initGame( game ) )
			.catch( error => console.error( error ) );
	}
}

export function getGameId() {
	return window.location.hash.split( '#' )[ 1 ];
}

export function setTitleMessage( message ) {
	document.title = message;
}
