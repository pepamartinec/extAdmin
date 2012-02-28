Ext.define( 'extAdmin.component.dataBrowser.action.Filter',
{	
	extend : 'extAdmin.component.dataBrowser.AbstractAction',
	
	params   : {
		groupID   : null,
		view      : null,
		isDefault : false,
		items     : {}
	},
	
	defaultApplied : false,

	/**
	 * Constructor
	 * 
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		me.dataBrowser = config.dataBrowser;
		
		if( me.params.isDefault ) {
			me.dataBrowser.setFilters( me.params.items );
		}
	},
	
	handler : function( button, e )
	{
		var me = this;
		
		var filters;
		if( button.pressed == false ) {
			if( me.params.groupID ) {
				return;
			}
			
			filters = {};
			
			for( var fName in me.params.items ) {
				filters[ fName ] = null;
			}
			
		} else {
			filters = me.params.items;
		}
		
		if( me.params.view ) {
			me.dataBrowser.switchView( me.params.view );
		}
		
		me.dataBrowser.setFilters( filters ).applyFilters();
	},
	
	createButton : function( options, type )
	{
		var me = this;
		
		options = options || {};
		
		Ext.applyIf( options, {
			toggleGroup  : me.params.groupID,
			allowDepress : me.params.groupID == null
		});
		
		Ext.apply( options, {
			iconCls : me.getIconCls(),
			text    : me.getText(),
			
			enableToggle : true,
			pressed      : me.params.isDefault,
			
			scope   : me,
			toggleHandler : me.handler
		});
		
		var button = Ext.create( type || 'Ext.button.Button', options );
		
		me.addComponent( button );
		
		return button;
	}
});
