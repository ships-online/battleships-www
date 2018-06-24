import Battleships from 'battleships-core/src/game';
import { settings as gameSettings } from 'battleships-ui-vue/src/utils';
import isEqual from '@ckeditor/ckeditor5-utils/src/lib/lodash/isEqual';

import Vue from 'vue';
import GameView from 'battleships-ui-vue/src/game.vue';
import GameOverView from 'battleships-ui-vue/src/gameover.vue';

/**
 * Bootstraps the game.
 *
 * @param {String} socketUrl
 * @param {HTMLElement} mainEl
 * @param {String|Object} idOrSettings
 */
export function bootstrap( socketUrl, mainEl, idOrSettings ) {
	let game, gameView, gameOverView;

	// Create the game on init.
	createGame( idOrSettings )
		.then( game => {
			initGame( game );
			document.body.classList.add( 'game-ready' );
		} )
		.catch( error => {
			showGameOverScreen( error );
			document.body.classList.add( 'game-ready' );
		} );

	/**
	 * Returns the game instance where client created a new battle or joined to the existing one.
	 *
	 * @private
	 * @param {String|Object} idOrSettings
	 * @returns {Promise.<Battleships>}
	 */
	function createGame( idOrSettings ) {
		if ( typeof idOrSettings === 'string' ) {
			return Battleships.join( socketUrl, idOrSettings );
		}

		return Battleships.create( socketUrl, idOrSettings );
	}

	/**
	 * Creates the UI and binds the game with it.
	 *
	 * @private
	 * @param {Battleships} newGame
	 */
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

		game.opponent.on( 'change:isWaitingForRematch', ( evt, name, value ) => {
			if ( game.status === 'over' && value ) {
				setTitleMessage( 'Rematch?' );
			}
		} );

		game.on( 'error', ( evt, error ) => showGameOverScreen( error ) );

		gameView = new Vue( {
			el: '#game',
			data: {
				game,
				onSettingsChange: handleNewSettings
			},
			render: h => h( GameView )
		} );
	}

	/**
	 * Shows {@link GameOverView}.
	 *
	 * @private
	 * @param {Error} error
	 */
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
			render: h => h( GameOverView )
		} );
	}

	/**
	 * Handles new game settings and creates new game in the place of the old one.
	 *
	 * @private
	 * @param {Object} settings
	 * @param {String} settings.size
	 * @param {Object} settings.shipsSchema
	 */
	function handleNewSettings( settings ) {
		const { size, shipsSchema } = settings;
		const battlefield = game.player.battlefield;

		if ( battlefield.size === size && isEqual( battlefield.shipsSchema, shipsSchema ) ) {
			return;
		}

		gameSettings.set( 'gameSettings', { size, shipsSchema } );

		game.destroy();
		gameView.$destroy();
		mainEl.querySelector( '.wrapper' ).innerHTML = '<div id="game" class="battleships"></div>';

		createGame( { size, shipsSchema } )
			.then( game => initGame( game ) )
			.catch( error => console.error( error ) );
	}
}

/**
 * Tries to get game id from the url.
 *
 * @returns {String}
 */
export function getGameId() {
	return window.location.hash.split( '#' )[ 1 ];
}

/**
 * Sets message to the <title/> element.
 *
 * @param {String} message
 */
export function setTitleMessage( message ) {
	document.title = message;
}
