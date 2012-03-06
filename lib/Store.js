Ext.define( 'extAdmin.Store', {

requires : [
	'extAdmin.Model',
	'extAdmin.DataProxy'
],

statics : {

	/**
	 * Creates data store
	 * 
	 * @param {Object} config
	 * @return {Ext.data.AbstractStore}
	 */
	create : function( config )
	{		
		Ext.apply( config, {
		    remoteSort   : true,
		    remoteFilter : true,
		    
		    proxy : {
		    	type : 'extadmin',
		    	
		    	env         : config.env,
		    	loadAction  : config.loadAction,
		    	writeAction : config.writeAction,
		    	
			    listeners : {
			    	exception : function( store, response, operation ) {
			    		Ext.Error.raise({
			    			msg : 'Data load failed',
			    			store     : store,
			    			operation : operation,
			    			response  : response
			    		});
			    	}
			    }
		    }
		});
		
		delete config.env;
		delete config.loadAction;
		delete config.writeAction;
		
		var type = config.type || 'Ext.data.Store';
		delete config.type;
		
		return Ext.create( type, config );
	},

	
	
	
	
	
	
	
	
	
	
	getModifiedData : function( store )
	{
		var records = store.getNewRecords() || [];
		records = Ext.Array.merge( records, store.getUpdatedRecords() );
		
		if( records.length == 0 ) {
			return null;
		}
		
		var data = [];
		
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			data.push( records[i].data );
		}
		
		return data;
	},
	
	getRemovedData : function( store )
	{
		var records = store.getRemovedRecords() || [];
		
		if( records.length == 0 ) {
			return null;
		}
		
		var data = [];
	
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			data.push( records[i].data );
		}
		
		return data;  		
	},
	
	getDataToSubmit : function( store )
	{
		var modified = this.getModifiedData( store ),
		    removed  = this.getRemovedData( store );
		
		if( modified == null && removed == null ) {
			return null;
		}
		
		var data = {};
		
		if( modified != null ) {
			data.modified = modified;
		}
		
		if( removed != null ) {
			data.removed = removed;
		}
		
		return data;
	},
	
	addForeing : function( store, records, mapping )
	{
		if( Ext.isArray( records ) == false ) {
			records = [ records ];
		}
		
		var rData, lData,
			data = [];
		
		for( var i = 0, rl = records.length || 0; i < rl; ++i ) {
			rData = records[i].data;
			lData = {};
			
			for( var idx in mapping ) {
				if( mapping.hasOwnProperty( idx ) == false ) {
					continue;
				}
				
				if( rData.hasOwnProperty( mapping[ idx ] ) == false ) {
					Ext.Error.raise({
						msg : "Remote record has no such item '"+ mapping[ idx ]+"'"
					});
				}
					
				lData[ idx ] = rData[ mapping[ idx ] ];
			}
			
			data.push( lData );
		}
		
		store.loadData( data , true );
	}
}});