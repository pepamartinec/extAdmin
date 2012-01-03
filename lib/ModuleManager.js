Ext.define( 'extAdmin.ModuleManager',
{	
	requires : [
		'Ext.Error',
		'extAdmin.Module'
	],
	
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
	 * @property {Ext.util.MixedCollection} modules
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
		me.modules = Ext.create( 'Ext.util.MixedCollection' );
	},
	
	/**
	 * Loads module definition by sending synchronous request to the server
	 * 
	 * @private
	 * @param   {String} name module name
	 * @returns {Object} module definition
	 */
	loadModuleDefinition : function( name, cb )
	{
		var me = this;
		
		me.env.request.request({
			module : '\\ExtAdmin\\Module\\SystemModule',
			action : 'getModuleDefinition',
			
			async : false,
			data  : {
				module : name 
			},
			
			failure : function( response ) {
				Ext.Error.raise({
					msg : 'ModuleManager failed to load modules definition'
				});
			},
			
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
				
				extAdmin.callback( cb );
			}
		});
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
		console.log(module);
		if( Ext.isString( module ) ) {
			if( me.isLoaded( module ) === false ) {
				me.loadModuleDefinition( module );
			}
			
			module = me.modules.getByKey( module );
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