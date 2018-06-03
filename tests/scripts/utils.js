import { getGameId } from '../../src/scripts/utils';

describe( 'getGameId()', () => {
	it( 'should return gameId from hash', () => {
		window.location.hash = 'abc';

		expect( getGameId() ).to.equal( 'abc' );
	} );
} );
