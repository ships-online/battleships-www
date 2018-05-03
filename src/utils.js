export function getGameId() {
	return window.location.hash.split( '#' )[ 1 ];
}

export function getQueryParams( paramsString ) {
	const params = paramsString.split( '&' );

	return params.reduce( ( result, param ) => {
		param = param.split( '=' );

		result[ param[ 0 ] ] = param[ 1 ];

		return result;
	}, {} );
}
