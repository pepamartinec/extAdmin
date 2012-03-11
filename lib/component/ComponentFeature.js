Ext.define( 'extAdmin.component.ComponentFeature',
{
	/**
	 * @required
	 * @cfg {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * @property {Object} actions
	 */
	actions : null,
	
//	/**
//	 * Component feature constructor
//	 * 
//	 */
//	constructor : function()
//	{
//		var me = this;
//	},
	
	/**
	 * Factories instances of supplied actions
	 * 
	 * @param {String[]} actions
	 * @param {Object/Null} config
	 */
	factoryActions : function( actions, config )
	{
		var me = this;
		
		Ext.applyIf( config || {}, {
			module : {},
			record : { component : me }
		});
		
		me.actions = me.module.factoryActions( actions, config );
	},
	
	/**
	 * Adds action run interceptor to action config
	 * 
	 * @param {Object} actionConfig Action factory cofnig
	 * @param {Object} interceptorConfig Interceptor config
	 */
	addActionInterceptor : function( actionConfig, interceptorConfig )
	{
		var prevScope = actionConfig.scope;
		delete actionConfig.runScope;
		
		var scope = interceptorConfig.scope;
		
		if( interceptorConfig.before ) {
			var beforeCb = interceptorConfig.before;
			
			if( actionConfig.runBefore ) {
				var prevBeforeCb = actionConfig.runBefore;
				
				actionConfig.runBefore = function( action, cb, cbScope ) {
					Ext.callback( prevBeforeCb, prevScope, [ action, beforeCb, scope ] );
				};
				
			} else {				
				actionConfig.runBefore = function( action, cb, cbScope ) {
					Ext.callback( beforeCb, scope, arguments );
				};
			}
		}
		
		if( interceptorConfig.after ) {
			var afterCb = interceptorConfig.after;
			
			if( actionConfig.runAfter ) {
				var prevAfterCb = actionConfig.runAfter;
				
				actionConfig.runAfter = function( action, cb, cbScope ) {
					Ext.callback( prevAfterCb, prevScope, [ action, afterCb, scope ] );
				};
				
			} else {				
				actionConfig.runAfter = function( action, cb, cbScope ) {
					Ext.callback( afterCb, scope, arguments );
				};
			}
		}
	},
	
	/**
	 * Returns action instance
	 * 
	 * @param {String} name Action name
	 * @returns {extAdmin.action.AbstractAction/Null}
	 */
	getAction : function( name )
	{
		return this.actions[ name ] || null;
	},
	
	/**
	 * Updates actions states
	 * 
	 */
	updateActionsStates : function()
	{
		var actions = this.actions;
		
		for( var aName in actions ) {
			actions[ aName ].updateState();
		}
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
		
		Ext.applyIf( config, {
			maskTarget : me
		});
		
		me.module.runAction( action, config );
	}
});