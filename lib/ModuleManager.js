Ext.define( 'extAdmin.ModuleManager',
{	
	requires : [
		'Ext.util.HashMap',
		'Ext.Error',
		'extAdmin.Module'
	],
	
	statics : {
		SYSTEM_MODULE_NAME : '\\ExtAdmin\\Module\\SystemModule'
	},
	
	/**
	 * Runtime environment
	 * 
	 * @config {extAdmin.Environment}
	 */
	env : null,
	
	/**
	 * Modules definitions store
	 * 
	 * @protected
	 * @property {HashMap} modules
	 */
	modules : null,
	
	/**
	 * Constructor
	 * 
	 * @constructor
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.env     = config.env;
		me.modules = Ext.create( 'Ext.util.HashMap' );
		
		me.clearCache();
	},
	
	/**
	 * Loads module definition by sending synchronous request to the server
	 * 
	 * @private
	 * @param   {String} name module name
	 * @returns {Object} module definition
	 */
	loadModuleDefinition : function( name )
	{
		var me = this;
		
		me.env.runAction( [ me.self.SYSTEM_MODULE_NAME, 'getModuleDefinition', { module : name } ], {
			
			async : false,
			
			success : function( response ) {
				var config = response.data;
				
				if( Ext.isObject( config ) === false ) {
					Ext.Error.raise({
						msg  : 'ModuleManager failed to load definition of "'+ name +'" module. Server response contains malformed data',
						data : config
					});
				}
				
				me.modules.add( name, Ext.create( 'extAdmin.Module', {
					name   : name,
					env    : me.env,
					config : config
				}) );
			},
			
			failure : function( response ) {
				Ext.Error.raise({
					msg : 'ModuleManager failed to load modules definition'
				});
			}
		});
	},
	
	/**
	 * Clear inner modules definition cache
	 * 
	 */
	clearCache : function()
	{
		this.modules.clear();
	//	this.loadModuleDefinition( 'SystemModule' );
	},
	
	/**
	 * Checks whether requested module is loaded yet
	 * 
	 * @param   {String} name module name
	 * @returns {Boolean}
	 */
	isLoaded : function( name )
	{
		return this.modules.containsKey( name );
	},
	
	/**
	 * Returns module instance
	 * 
	 * @param   {String|extAdmin.Module} module module name
	 * @returns {extAdmin.Module} module instance
	 */
	get : function( module )
	{
		var me = this;
		
		if( Ext.isString( module ) ) {
			module = module.replace( '.', '\\' );
			
			if( me.isLoaded( module ) === false ) {
				me.loadModuleDefinition( module );
			}
			
			module = me.modules.get( module );
		}
		
		if( module instanceof extAdmin.Module === false ) {
			Ext.Error.raise({
				msg    : 'Invalid module',
				module : module
			});
		}
		
		if( module.isInitialized !== true ) {
			module.init();
		}
		
		return module;
	}
});