/* global SOCKET_URL */

import { start, getGameId } from './utils';
import { settings } from 'battleships-ui-vue/src/utils';

import 'battleships-theme/src/styles/index.css';
import '../styles/main.css';

const mainEl = document.querySelector( 'main' );
const gameId = getGameId();

start( SOCKET_URL, mainEl, gameId || settings.get( 'gameSettings' ) );
