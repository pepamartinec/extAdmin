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
	 * Builds request URL
	 * 
	 * @param  {String} module Module name
	 * @param  {String} action Action name
	 * @return {String}
	 */
	buildUrl : function( module, action )
	{		
		return this.serverEndpoint +'?'+ Ext.urlEncode({
			module : module,
			action : action
		});
	},
	
	/**
	 * Runs server action
	 * 
	 * @async
	 * @param {Array} action Action pointer
	 * @param {Object} config Request configuration
	 */
	runAction : function( action, config )
	{
		var me = this;
		
		return me.request({
			url : me.buildUrl( action[0], action[1] ),
			
			method : 'POST',
			async  : config.async !== false,
			jsonData : {
				parameters : action[2],
				data       : config.data || null
			},
			
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
		});
	},
});