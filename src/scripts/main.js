/* global SOCKET_URL */

import { bootstrap, getGameId } from './utils';
import { settings } from 'battleships-ui-vue/src/utils';

import 'battleships-theme/src/styles/index.css';
import '../styles/main.css';

const mainEl = document.querySelector( 'main' );
const gameId = getGameId();

bootstrap( SOCKET_URL, mainEl, gameId || settings.get( 'gameSettings' ) );
