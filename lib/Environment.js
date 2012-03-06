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
	 * Creates data store
	 * 
	 * @param {Object} config
	 * @return {Ext.data.AbstractStore}
	 */
	createStore : function( config )
	{
		var me = this;
		
		if( config.loadAction ) {
			config.loadAction = me.normalizeActionPtr( config.loadAction );
		}
		
		if( config.saveAction ) {
			config.saveAction = me.normalizeActionPtr( config.saveAction );
		}
		
		config.env = me;
		
		return extAdmin.Store.create( config );
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
		
		action = me.normalizeActionPtr( action );
		
		me.request.runAction( action, config );
	},
	
	/**
	 * Normalizes action pointer config to absolute [module, action, params] form
	 * 
	 * @param  {Array/String} name Action specification
	 * @param  {extAdmin.Module} defaultModule Fallback module
	 * @param  {String} defaultAction Fallback action name
	 * @return {Array}  Normalized action pointer
	 */
	normalizeActionPtr : function( action, defaultModule, defaultAction )
	{
		// empty action -> use default
		if( Ext.isEmpty( action ) ) {
			if( Ext.isDefined( defaultAction ) === false ) {
				Ext.Error.raise({
					msg    : 'Neither action definition or default action set',
					action : action
				});
			}
			
			action = defaultAction;
		}
		
		// string action -> convert to array
		if( Ext.isString( action ) || Ext.isString( action ) ) {
			action = [ action ];	
		}
		
		if( Ext.isArray( action ) === false ) {
			Ext.Error.raise({
				msg    : 'Invalid action definition',
				action : action
			});
		}
		
		// fill missing items
		switch( action.length ) {
			case 1:				
				// parameters only
				if( Ext.isObject( action[0] ) ) {
					if( Ext.isDefined( defaultAction ) === false ) {
						Ext.Error.raise({
							msg    : 'Neither explicit or default action set',
							action        : action,
							defaultAction : defaultAction
						});
					}
					
					action = [ defaultModule, defaultAction, action[0] ];
					
				// relative module component name only
				} else {					
					action = [ defaultModule, action[0], {} ];
				}
				break;
			
			case 2:
				// relative name + params
				if( Ext.isObject( action[1] ) ) {
					action.unshift( defaultModule );
				
				// full action name without params
				} else {
					action.push( {} );
				}
				break;
			
			// fully specified action
			case 3:
				break;
				
			default:
				Ext.Error.raise({
					msg    : 'Invalid action definition',
					action : action
				});
		}
		
		if(
			( Ext.isString( action[0] ) || action[0] instanceof extAdmin.Module ) === false ||
			Ext.isString( action[1] ) === false ||
			Ext.isObject( action[2] ) === false
		) {
			Ext.Error.raise({
				msg    : 'Invalid action definition',
				action : action
			});
		}
		
		return action;
	}
});