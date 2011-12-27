Ext.define( 'extAdmin.Store', { statics : {
	
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
					throw "[Ext.LH.Store.addForeing] remote record has no such item '"+ mapping[ idx ]+"'";
				}
					
				lData[ idx ] = rData[ mapping[ idx ] ];
			}
			
			data.push( lData );
		}
		
		store.loadData( data , true );
	}
}});