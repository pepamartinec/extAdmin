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
});