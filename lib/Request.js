/**
 * Request helper class
 * 
 * @class extAdmin.Request
 */
Ext.define( 'extAdmin.Request',
{
	/**
	 * @cfg {String} serverHandle
	 */
	serverHandle : null,
	
	/**
	 * @cfg {Object} baseParams 
	 */
	baseParams : null,
	
	/**
	 * Creates new object instance
	 * 
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		Ext.applyIf( config, {
			baseParams : {}
		});
		
		Ext.apply( this, config );
	},
	
	/**
	 * Returns request base parameters
	 * 
	 * @returns {Object}
	 */
	getBaseParams : function()
	{
		return this.baseParams;
	},
	
	/**
	 * Creates URL using default and given parameters
	 * 
	 * @param   {Object} params additional (dynamic) parameters
	 * @returns {String}
	 */
	buildUrl : function( params )
	{
		params = Ext.Object.merge( {}, this.baseParams, params );
		
		return this.serverHandle +'?'+ Ext.urlEncode( params );
	},

	/**
	 * Requests data from server
	 * 
	 * @async
	 * @param {Object} config
	 */
	send : function( config )
	{
		Ext.Ajax.request({
			url    : this.buildUrl( config.params || {} ),
			method : 'POST',
			params : config.data || {},
			async  : config.async !== false,
			
			callback : function( options, success, response ) {
				response = Ext.JSON.decode( response.responseText );
				
				// call 'complete' callback
				Ext.callback( config.complete, config.scope, [ response ] );
								
				// call 'success' callback
				if( response.success ) {
					Ext.callback( config.success, config.scope, [ response ] );
					
				// call 'failure' callback
				} else {
					if( config.failure === undefined ) {
						extAdmin.ErrorHandler.fireRecoverable({
							msg : response.message || 'unknown'
						});
					}
					
					Ext.callback( config.failure, config.scope, [ response ] );
				}
			}
		});
	},
	
	/**
	 * Creates dataStore using baseParams and given config
	 * 
	 * @param {Object} options
	 * @returns
	 */
	createStore : function( options )
	{
		var type = options.type || 'Ext.data.Store';
		delete options.type;
		
		var url = Ext.isString( options.url ) ? options.url : this.buildUrl( options.url || {} );
		delete options.url;
		
		var params = options.params;
		delete options.params;
		
		options = Ext.Object.merge({
			model        : null, // fill from options
			fields       : null, // fill from options
			autoLoad     : false,
		    remoteSort   : true,
		    remoteFilter : true,
		    simpleSortMode : true,
		    
			proxy  : {
			    type        : 'ajax',
			    url         : url,
			    extraParams : params,
				
			    actionMethods: {
			        create : 'POST',
			        read   : 'POST',
			        update : 'POST',
			        destroy: 'POST'
			    },
				
				listeners : {
					exception : function( proxy, response, operation ) {
						extAdmin.ErrorHandler.handleDataRequestFailure( operation, response );
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
	}	
});