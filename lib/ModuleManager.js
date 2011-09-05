Ext.define( 'extAdmin.ModuleManager',
{	
	requires : [
		'Ext.Error',
		'extAdmin.Module'
	],
	
	singleton : true,
	
	/**
	 * Set of loaded modules definitions
	 * 
	 * @protected
	 * @property {Object} modules
	 */
	modules : null,
	
	/**
	 * Constructor
	 * 
	 * @constructor
	 */
	constructor : function()
	{
		var me = this;
		
		me.modules = {};
	},
	
	/**
	 * Loads module definition by sending synchronous request to the server
	 * 
	 * @private
	 * @param   {String} name module name
	 * @returns {Object} module definition
	 */
	loadModule : function( name )
	{
		var me = this;
		
		// !!synchronously!! load definition
		Ext.Ajax.request({
			method : 'POST',
			url    : extAdmin.serverHandle +'?module='+ name +'&request=interfaceDefinition',
			async  : false,
			
			success : function( response ) {
				response = Ext.JSON.decode( response.responseText );
					
				if( !response ) {
					Ext.Error.raise("Failed to load definition for module '"+ name +"'");
				}
				
				me.modules[ name ] = Ext.create( 'extAdmin.Module', extAdmin.serverHandle, name, response.data );
			},
			
			failure : function( response ) {				
				Ext.Error.raise( "Failed to load definition for module '"+ name +"'" );
			}
		});
	},
	
	/**
	 * Checks wether requested module is loaded yet
	 * 
	 * @param   {String} name module name
	 * @returns {Boolean}
	 */
	isLoaded : function( name )
	{
		return this.modules.hasOwnProperty( name );
	},
	
	/**
	 * Returns module definition
	 * 
	 * @param   {String|extAdmin.Module} module module name
	 * @param   {Object|Null} customConf additional interface configuration
	 * @returns {extAdmin.Module} module definition
	 */
	get : function( module, customConf )
	{
		if( Ext.isString( module ) ) {
			if( this.isLoaded( module ) == false ) {
				this.loadModule( module );
			}
			
			module = this.modules[ module ];
		}
		
		if( module instanceof extAdmin.Module === false ) {
			Ext.Error.raise("Invalid module requested");
		}
		
		if( customConf ) {
			module. Ext.clone( module );
			module.applyConfig( customConf );
		}
		
		return module;
	}
});
