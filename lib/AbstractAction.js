Ext.define( 'extAdmin.AbstractAction',
{
	extend : 'Ext.Action',
	
	requires : [ 'extAdmin.ModuleManager' ],
	
	statics : {
		iconsBase : 'images/icons/'
	},
	
	module   : null,
	name     : null,
	
	multiRow : false,
	dataDep  : false,
	params   : {},
	
	texts : {
		title : 'unknown'
	},
	
	constructor : function( module, name, definition )
	{
		var me = this;
		
		me.callParent([{		
			text    : definition.title   || me.texts.title,
			iconCls : definition.iconCls || me.iconCls,
			handler : me.handler,
			scope   : me
		}]);
		
		Ext.apply( me, {
			module   : extAdmin.ModuleManager.get( definition.module || module ),
			name     : name,
			multiRow : Ext.isDefined( definition.multiRow ) ? definition.multiRow : me.multiRow,
			dataDep  : Ext.isDefined( definition.dataDep )  ? definition.dataDep  : me.dataDep,
			params   : Ext.Object.merge( {}, me.params, definition.params || {} )
		});
	},
	
	/**
	 * Creates new button attached to this action
	 * 
	 * @param   {Object} options
	 * @returns {Ext.button.Button}
	 */
	createButton : function( options, type )
	{
		var action = this;
		
		var button = Ext.create( type || 'Ext.button.Button', {
			iconCls : action.getIconCls(),
			text    : action.getText(),
			
			handler : function() {
				// pick records
				var recordsCb      = options.records,
				    recordsCbScope = options.recordsScope || options.scope || window,
				    records        = null;
				
				if( recordsCb ) {
					records = recordsCb.apply( recordsCbScope );
				}
				
				// before execute
				var be      = options.beforeExecute,
				    beScope = options.beforeExecuteScope || options.scope || window;
				
				if( be && be.apply( beScope, [ records ] ) == false ) {
					return;
				}
				
				// execute
				var ae      = options.afterExecute || Ext.emptyFn,
				    aeScope = options.afterExecuteScope || options.scope || window;
				
				action.handler.apply( action, [ records, ae, aeScope ] );				
			},
			
			destroy : function() {
				actions.removeComponent( this );
			}
		});
		
		action.addComponent( button );
		
		return button;
	},
	
	isMultiRow : function()
	{
		return this.multiRow;
	},
	
	isDataDependant : function()
	{
		return this.dataDep;
	},
	
	getIcon : function()
	{
		return this.icon ? extAdmin.AbstractAction.iconsBase + this.icon : null;
	},
	
	handler : Ext.emptyFn
});