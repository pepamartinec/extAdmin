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
	},
	
	/**
	 * Returns module instance
	 * 
	 * @public
	 * @param   {String|extAdmin.Module} module module name
	 * @returns {extAdmin.Module} module instance
	 */
	getModule : function( module )
	{
		return this.moduleManager.get( module );
	},
	
	/**
	 * Creates URL given parameters
	 * 
	 * @public
	 * @param   {Object} params additional parameters
	 * @returns {String}
	 */
	buildUrl : function( params )
	{
		return this.request.buildUrl( params );
	},
	
	/**
	 * Create dataStore instance
	 * 
	 * @param   {Object} options
	 * @returns {Ext.data.AbstractStore}
	 */
	createStore : function( options )
	{
		Ext.applyIf( options, {
			env : this
		});
		
		if( Ext.isString( options.module ) ) {
			options.module = this.getModule( options.module );
		}
		
		return extAdmin.Store.create( options );
	}
});