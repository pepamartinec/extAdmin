Ext.define( 'extAdmin.AbstractAction',
{
	extend : 'Ext.Action',
	
	requires : [
		'extAdmin.ModuleManager'
	],
	
	statics : {
		iconsBase : 'images/icons/'
	},
	
	module   : null,
	name     : null,
	params   : {},
	
	texts : {
		title : 'unknown'
	},
	
	constructor : function( config )
	{
		var me = this;
		
		me.callParent([{		
			text    : config.title   || me.texts.title,
			iconCls : config.iconCls || me.iconCls,
			handler : me.handler,
			scope   : me
		}]);
		
		Ext.apply( me, {
			module   : extAdmin.ModuleManager.get( config.module ),
			name     : config.name,
			params   : Ext.Object.merge( {}, me.params, config.params || {} )
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
		var me = this;
		
		// pick records
		var recordsCb      = options.records,
		    recordsCbScope = options.recordsScope || options.scope || window,
		    records        = null;
		
		delete options.records;
		delete options.recordsScope;
		
		// before execute
		var be      = options.beforeExecute,
		    beScope = options.beforeExecuteScope || options.scope || window;
		
		delete options.beforeExecute;
		delete options.beforeExecuteScope;
		
		// execute
		var ae      = options.afterExecute || Ext.emptyFn,
		    aeScope = options.afterExecuteScope || options.scope || window;
		
		delete options.afterExecute;
		delete options.afterExecuteScope;
		delete options.scope;
		
		Ext.applyIf( options, {
			iconCls : me.getIconCls(),
			text    : me.getText(),
			
			handler : function( btn, e ) {				
				// pick records			
				if( recordsCb ) {
					records = recordsCb.apply( recordsCbScope );
				}
				
				// before execute			
				if( be && be.apply( beScope, [ records ] ) == false ) {
					return;
				}
				
				// execute			
				me.handler.apply( me, [ records, ae, aeScope ] );
			}			
		});
		
		
		var button = Ext.create( type || 'Ext.button.Button', options );
		
		me.addComponent( button );
		
		return button;
	},
	
	getIcon : function()
	{
		return this.icon ? extAdmin.AbstractAction.iconsBase + this.icon : null;
	},
	
	getParam : function( name )
	{
		return this.params[ nam ];
	},
	
	updateState : Ext.emptyFn,
	
	handler : Ext.emptyFn
});