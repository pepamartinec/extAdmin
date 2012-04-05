/**
 * @class extAdmin
 * 
 * @singleton
 */
var extAdmin = extAdmin || {};

(function(){

	Ext.apply( extAdmin, {
		
		applyConfig : function( object, config )
		{
			if( object && config ) {
				for( var property in config ) {
					if( config[property] !== undefined ) {
						object[property] = config[property];
					}
				}
			}
	
	        return object;
		},
		
		applyConfigIf : function( object, config )
		{
			if( object && config ) {
				for( var property in config ) {
					if( object[property] === undefined && config[property] !== undefined ) {
						object[property] = config[property];
					}
				}
			}
	
	        return object;
		},
		
		applySafe : function( object, config )
		{
			if( object && config && typeof config === 'object' ) {
				for( var property in object ) {
					if( object.hasOwnProperty( property ) === false ) {
						continue;
					}
					
					if( config[property] !== undefined ) {
						object[property] = config[property];
					}
				}
			}
	
	        return object;
		},
		
	    abstractFn : function()
	    {
	    	Ext.Error.raise({
	    		msg: 'Not implemented abstract method called',
	    		'this' : this
	    	});
	    }
	});


	
	var chain = [ [ document.getElementById, document ] ];
	
	var buildGetter = function()
	{
		var ln    = chain.length,
		    getFn = null;
		
		if( ln === 1 ) {
			getFn = chain[0][0];
			
		} else {
			var getFnParts = [];
			
			for( var i = 0; i < ln; ++i ) {
				getFnParts.push( "chain["+ i +"][0].apply( chain["+ i +"][1], arguments )" );
			}
			
			getFn = new Function( 'chain', 'return function( id ) { return '+ getFnParts.join(' || ') +'; }' )( chain );
		}
		
		document.getElementById = getFn;
	};
	
	Ext.apply( extAdmin, {
		/**
		 * Adds element getter to document.getElementById chain
		 * 
		 * @param {Function} fn
		 * @param {Mixed} scope
		 */
		addElementGetter : function( fn, scope )
		{
			chain.push( [ fn, scope ] );
			
			buildGetter();
		},
		
		/**
		 * Removes element getter from document.getElementById chain
		 * 
		 * @param {Function} fn
		 */
		removeElementGetter : function( fn )
		{
			Ext.Array.forEach( chain, function( item, i ) {
				if( item[0] == fn ) {
					Ext.Array.remove( chain, item );
				}
			});
			
			buildGetter();
		}
	});
	
}());
