/**
 * Request helper class configured specially for one module
 * 
 * @class extAdmin.ModuleRequest
 */
Ext.define( 'extAdmin.ModuleRequest',
{
	extend : 'extAdmin.Request',
	
	/**
	 * @config {extAdmin.Module}
	 */
	module : null,
	
	/**
	 * Class constructor
	 * 
	 * @constructor
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.module = config.module;
		
		me.callParent([{
			serverEndpoint : config.envRequest.serverEndpoint
		}]);
	},

	/**
	 * Requests data from server
	 * 
	 * @async
	 * @param {Object} config
	 */
	request : function( config )
	{
		if( config.module == null ) {
			config.module = this.module.getId();
		}
		
		return this.callParent( arguments );
	}
});