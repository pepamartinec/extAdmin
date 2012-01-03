Ext.define( 'extAdmin.action.ActionManager',
{
	requires : [
		'Ext.util.MixedCollection'
	],
	
	singleton : true,
	
	actions : null,
	
	constructor : function()
	{
		var me = this;
		
		me.actions = Ext.create( 'Ext.util.MixedCollection' );
	},
	
	registerAction : function( cls )
	{		
		var className = Ext.ClassManager.getClassName( cls );
	},
	
	factoryAction : function( type, config )
	{
		
	},
	
	
	
	
	
	
	
	/**
	 * Creates actions instances of given type
	 * 
	 * @private
	 * @param {Object} actionsDefinitions
	 */
	initActions : function( type, config )
	{
		var me = this,
		    definitions = me.config.actions;
		
		for( var actionName in definitions ) {
			if( definitions.hasOwnProperty( actionName ) === false ) {
				continue;
			}
			
			var definition = definitions[ actionName ];
			
			if( definition.type == null ) {
				Ext.Error.raise({
					msg : 'Missing action type definition for action "'+ actionName +'"',
					actionName : actionName,
					actionDef  : definition
				});
			}
			
			var actionType = Ext.String.capitalize( definition.type ),
			    className  = 'extAdmin.action.'+ type +'.'+ actionType;
			
			if( Ext.ClassManager.get( className ) == null ) {
				continue;
			}
			
			me.actions[ actionName ] = Ext.create( className, Ext.apply({
				name   : actionName,
				module : me
			}, definition, config ) );
		}
	},
});