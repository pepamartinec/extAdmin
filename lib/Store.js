Ext.define( 'extAdmin.Store', {

requires : [
	'extAdmin.Model',
	'Ext.data.proxy.Ajax'
],

statics : {

	/**
	 * Creates dataStore
	 * 
	 * @param {Object} options
	 * @returns
	 */
	create : function( options )
	{
		// pick module
		var module = options.module;
		delete options.module;
		
		// pick loadAction
		var loadAction = options.action || options.loadAction;
		delete options.action;
		delete options.loadAction;
		
		// pick store type
		var type = options.type || 'Ext.data.Store';
		delete options.type;
		
		// pick extra params
		var params = options.params;
		delete options.params;
		
		options = Ext.Object.merge({
			autoLoad     : false,
		    remoteSort   : true,
		    remoteFilter : true,
		    
			proxy  : {
			    type : 'ajax',
			    url  : module.buildUrl({
					action : loadAction
				}),
			    extraParams : params,
				
			    actionMethods: {
			        create : 'POST',
			        read   : 'POST',
			        update : 'POST',
			        destroy: 'POST'
			    },
				
				listeners : {
					exception : function( proxy, response, operation ) {
						// TODO
					}
				},
				
				reader : {
					type : 'json',
					
					idProperty      : 'ID',
					messageProperty : 'message',
					root            : 'data',
					successProperty : 'success',
					totalProperty   : 'total'
				},

				encodeSorters : function( sorters )
				{
					var params = {};
					for( var i = 0, sl = sorters.length; i < sl; ++i ) {
						var sorter = sorters[i];
						
						params[ sorter.property ] = sorter.direction;
					}
					
					return params;
				},

				encodeFilters : function( filters )
				{					
					var params = {};
					for( var i = 0, fl = filters.length; i < fl; ++i ) {
						var filter = filters[i];
						
						params[ filter.property ] = filter.value;			
					}
					
					return params;
				}
			}
		}, options );		
		
		return Ext.create( type, options );
	},
	
	/**
	 * Creates configuration object of dataStore by simplified server-side configuration
	 * 
	 * @static
	 * @param {Object}          owner
	 * @param {extAdmin.Module} module
	 * @param {Object}          config
	 */
	configByServer : function( owner, module, config )
	{		
		// check fields config
		if( config.fields == null ) {
			Ext.Error.raise({
				msg    : 'Fields configuration is missing',
				config : config
			});
		}
		
		// clone config fields
		// so we can modify list locally
		var fields = Ext.Object.merge( {}, config.fields );
		
		// apply ID field defaults
		var idField = fields.ID || {};
		
		Ext.applyIf( idField, {
			type : 'int'
		});
		
		fields.ID = idField;
		
		
		// create model
		var modelFields = [],
		    field, item;
		
		for( var dataIdx in fields ) {
			item  = fields[ dataIdx ];
			field = {
				name : dataIdx
			};
			
			extAdmin.applyConfigIf( field, {
				defaultValue : item.defaultValue,
				useNull      : item.useNull
			});
			
			switch( item.type ) {
				case 'date':
				case 'datecolumn':
				
				case 'datetime':
				case 'datetimecolumn':
					field.type       = item.dataType   || 'datetime';
					field.dateFormat = item.dateFormat || "Y-m-d H:i:s";
					break;
					
				case 'currency':
				case 'currencycolumn':
					field.type = 'float';
					
					if( item.currencyField ) {
						modelFields.push({
							name : item.currencyField,
							type : 'string'
						});
					}
					break;
				
				default:
					break;
			}
			
			modelFields.push( field );
		}
		
		var modelName = owner.$className +'.AnonymousModel-'+ Ext.id();
	    
		Ext.define( modelName, {
	    	extend : 'extAdmin.Model',
	    	fields : modelFields
	    });
		
		// create store
		var storeConfig = {
			model         : modelName,
			implicitModel : true,
			
			module     : module,
			loadAction : config.loadAction
		};
		
		if( config.sort ) {
			var sort = config.sort;
			
			storeConfig.sorters = {
				property  : sort.column,
				direction : sort.dir || 'asc'
			};
		}
		
		return storeConfig;
	},
	
	/**
	 * Creates dataStore instance by simplified server-side configuration
	 * 
	 * @static
	 * @param {Object} config
	 */
	createByServer : function( config )
	{
		// create store configuration
		var storeConfig = extAdmin.Store.configByServer( config.owner, config.module, config.serverConfig );
		
		// remove used config items
		delete config.owner;
		delete config.module;
		delete config.serverConfig;
		
		// apply remaining config items as direct store config
		Ext.apply( storeConfig, config );
		
		return extAdmin.Store.create( storeConfig );
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