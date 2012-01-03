/**
 * Request helper class
 * 
 * @class extAdmin.Request
 */
Ext.define( 'extAdmin.Request',
{
	extend : 'Ext.data.Connection',
	
	requires : [
		'Ext.data.proxy.Ajax',
		'Ext.data.reader.Json'
	],
	
	uses : [
		'Ext.data.Store',
		'Ext.data.TreeStore',
	],
	
	statics : {
		FAIL_COMM   : 'comm',
		FAIL_SERVER : 'server'
	},
	
	/**
	 * @cfg {String} serverEndpoint
	 */
	serverEndpoint : null,
	
	/**
	 * Creates URL given parameters
	 * 
	 * @protected
	 * @param   {Object} params additional parameters
	 * @returns {String}
	 */
	buildUrl : function( params )
	{
		var url = this.serverEndpoint;
		
		if( params ) {
			url += '?'+ Ext.urlEncode( params );
		}
		
		return url;
	},

	/**
	 * Requests data from server
	 * 
	 * @async
	 * @param {Object} config
	 */
	request : function( config )
	{
		var me = this;
		
		return me.callParent([{
			url : me.buildUrl({
				module : config.module,
				action : config.action
			}),
			
			method : config.data ? 'POST' : 'GET',
			params : config.data,
			async  : config.async !== false,
			
			callback : function( options, success, response ) {
				
				// server responded OK
				if( success ) {
					var responseContent;
					
					// server responded valid JSON
					try {
						responseContent = Ext.JSON.decode( response.responseText );
						
						if( responseContent.success !== true ) {
							responseContent.failureType = extAdmin.Request.FAIL_SERVER;
							responseContent.failureCode = null;
						}
					
					// server responded malformed JSON
					} catch( e ) {						
						responseContent = {
							success     : false,
							failureType : extAdmin.Request.FAIL_COMM,
							failureCode : null,
							message     : 'Server response is on a valid JSON string',
							data        : response.responseText
						};
					}
				
				// server responded NOT OK
				} else {
					responseContent = {
						success     : false,
						failureType : extAdmin.Request.FAIL_COMM,
						failureCode : response.status,
						message     : response.statusText,
						data        : response.responseText
					};					
				}
				
				console.dir( responseContent );
				
				// call 'complete' callback
				Ext.callback( config.complete, config.scope, [ responseContent ] );
								
				// call 'success' callback
				if( responseContent.success ) {
					Ext.callback( config.success, config.scope, [ responseContent ] );
					
				// call 'failure' callback
				} else {					
					Ext.callback( config.failure, config.scope, [ responseContent ] );
				}
			}
		}]);
	},
	
	/**
	 * Creates dataStore
	 * 
	 * @param {Object} options
	 * @returns
	 */
	createStore : function( options )
	{
		var module = options.module;
		delete options.module;
		
		var action = options.action;
		delete options.action;
		
		var type = options.type || 'Ext.data.Store';
		delete options.type;
		
		var params = options.params;
		delete options.params;
		
		options = Ext.Object.merge({
			autoLoad     : false,
		    remoteSort   : true,
		    remoteFilter : true,
		    
			proxy  : {
			    type : 'ajax',
			    url  : this.buildUrl({
					module : module,
					action : action
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
		console.log(options.model);
		return Ext.create( type, options );
	}
});