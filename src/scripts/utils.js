import Battleships from 'battleships-core/src/game';
import Vue from 'vue';
import Game from 'battleships-ui-vue/src/game.vue';
import GameOver from 'battleships-ui-vue/src/gameover.vue';
import Settings from 'battleships-ui-vue/src/settings.vue';
import isEqual from '@ckeditor/ckeditor5-utils/src/lib/lodash/isEqual';

export function start( socketUrl, mainEl, gameEl, gameId ) {
	let game, gameView, gameOverView, settingsView;

	// Create the game on init.
	createGame( gameId )
		.then( game => {
			settingsView = new Vue( {
				el: '#settings',
				data: {
					onChange: handleNewSettings,
					disabled: true,
					tooltip: 'Start your own game to set new rules'
				},
				render: h => h( Settings )
			} );
			initGame( game );

			mainEl.classList.add( 'ready' );
		} )
		.catch( error => showGameOverScreen( error ) );

	function createGame( idOrSettings ) {
		if ( gameOverView ) {
			gameOverView.$destroy();
			gameEl.innerHTML = '';
			gameOverView = null;
		}

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
		console.error( error );

		setTitleMessage( 'Game over' );

		if ( gameOverView ) {
			throw new Error( 'Game over view already rendered.' );
		}

		if ( gameView ) {
			gameView.$destroy();
		}

		if ( settingsView ) {
			settingsView.$destroy();
		}

		mainEl.innerHTML = '';

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

		game.destroy();
		gameView.$destroy();
		document.querySelector( '.wrapper' ).innerHTML = '<div id="game" class="battleships"></div>';

		createGame( { size, shipsSchema } )
			.then( game => initGame( game ) )
			.catch( error => console.error( error ) );
	}

	function updateDisabledSettings( game ) {
		let isDisabled = game.status !== 'available' || game.interestedPlayersNumber > 0 || game.player.isReady;
		let tooltip = '';

		if ( game.status !== 'available' ) {
			isDisabled = true;
			tooltip = 'Cannot change game settings<br>after the game has started';
		} else if ( game.player.isReady ) {
			isDisabled = true;
			tooltip = 'Cannot change game settings<br>when you are ready for the battle';
		} else if ( game.interestedPlayersNumber > 0 ) {
			isDisabled = true;
			tooltip = 'Cannot change game settings<br>while there are interested players';
		}

		settingsView.disabled = isDisabled;
		settingsView.tooltip = tooltip;
	}
}

export function getGameId() {
	return window.location.hash.split( '#' )[ 1 ];
}

export default function setTitleMessage( message ) {
	document.title = message;
}
