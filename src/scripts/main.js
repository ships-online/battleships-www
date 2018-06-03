/* global SOCKET_URL */

import { start, getGameId } from './utils';

import 'battleships-theme/src/styles/index.css';
import '../styles/main.css';

const mainEl = document.querySelector( 'main' );
const gameEl = document.querySelector( '#game' );
const gameId = getGameId();

start( SOCKET_URL, mainEl, gameEl, gameId );
