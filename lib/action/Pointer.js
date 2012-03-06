Ext.define( 'extAdmin.action.Pointer',
{
	/**
	 * @property {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * @property {String} action
	 */
	action : null,
	
	/**
	 * @property {Object} params
	 */
	params : null,
	
	statics : {

	},
	
	/**
	 * Pinter constructor
	 * 
	 * @param {Array/String} config Pointer configuration
	 * @param {extAdmin.Module} defaultModule Fallback module
	 */
	constructor : function( config, defaultModule, defaultAction )
	{
		var me     = this,
		    env    = defaultModule.env,
		    config = me.self.normalizeConfig( config );
		
		me.module = env.getModule( config[0] );
		me.action = config[1];
		ma.params = config[2];
	},
	
	buildUrl : function()
	{
		this.module.buildUrl( this.action, this.params );
	}
});