Ext.define( 'extAdmin.DataProxy',
{
	extend : 'Ext.data.proxy.Server',
	alias  : 'proxy.extadmin',
	
	requires : [
		'Ext.data.reader.Json',
		'Ext.data.writer.Json'
	],
	
	/**
	 * @required
	 * @cfg {extAdmin.Environment} env
	 */
	env : null,
	
	/**
	 * @cfg {Array} loadAction
	 */
	loadAction : null,
	
	/**
	 * @cfg {Array} writeAction
	 */
	writeAction : null,
	
	/**
	 * Proxy constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		if( config.loadAction ) {
			config.reader = {
				type : 'json',
				
				messageProperty : 'message',
				root            : 'data',
				successProperty : 'success',
				totalProperty   : 'total'
			};
		}
		
		if( config.writeAction ) {
			config.writer = {
				type : 'json',
				
				allowSignle : false,
				root        : 'data'
			};
		}
			
		me.callParent( arguments );
	},
	
	/**
	 * Runs operation
	 * 
	 * @param {Ext.data.Operation} operation
	 * @param {Function} callback
	 * @param {Object} scope
	 * @return {Object}
	 */
	doRequest : function( operation, callback, scope )
	{
		var me      = this,
		    request = me.buildRequest( operation, callback, scope );
		
		// add writer data
		if( operation.allowWrite() ) {
			request = writer.write( request );
		}
		
		Ext.apply( request, {
			method   : 'POST',
			timeout  : me.timeout,
			scope    : me,
			callback : me.createRequestCallback( request, operation, callback, scope ),
			disableCaching : false
		});
		
		var jsonData = request.jsonData || {};
		jsonData.params = request.params;
		
		request.params   = undefined;
		request.jsonData = jsonData;
		
		me.env.request.request( request );
		
		return request;
	},
	
	/**
	 * Returns request URL using operation action
	 * 
	 * @param {Object} request
	 * @return {String}
	 */
	getUrl : function( request )
	{
		var me         = this,
		    action     = ( request.operation.action === 'read' ) ? me.loadAction : me.writeAction,
		    envRequest = me.env.request;
		
		return envRequest.buildUrl( action[0], action[1] );
	},
	
	createRequestCallback : function( request, operation, callback, scope )
	{
		var me = this;
		
		return function( options, success, response ) {
			me.processResponse( success, operation, request, response, callback, scope );
		};
	}
	
});