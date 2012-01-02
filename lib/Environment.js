Ext.define( 'extAdmin.Environment',
{
	requires : [
	    'extAdmin.Request',
		'extAdmin.ModuleManager'
	],
	
	/**
	 * @public
	 * @property {extAdmin.Request}
	 */
	request : null,
	
	/**
	 * @public
	 * @property {extAdmin.ModuleManager}
	 */
	moduleManager : null,
	
	/**
	 * Environment initialization
	 * 
	 * @param config
	 * @param cb
	 */
	init : function( config, cb )
	{
		var me = this;
		
		me.request = Ext.create( 'extAdmin.Request', {
			serverEndpoint : config.serverEndpoint
		});
		
		me.moduleManager = Ext.create( 'extAdmin.ModuleManager', {
			env : me
		});
		
//		me.moduleManager.init( cb );
		
		extAdmin.callback( cb );
	}
});