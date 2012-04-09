Ext.define( 'extAdmin.patch.ExtObjectMap', {
	override : 'Ext.Object',

	map : function( obj, fn, scope )
	{
		var results = {};

		for( var idx in obj ) {
			if( obj.hasOwnProperty( idx ) === false ) {
				continue;
			}

			results[ idx ] = fn.call( scope, idx, obj[ idx ], obj );
		}

		return results;
	}
});