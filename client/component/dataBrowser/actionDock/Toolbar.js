Ext.define( 'extAdmin.component.dataBrowser.actionDock.Toolbar',
{
	extend : 'Ext.toolbar.Toolbar',

	requires : [
		'Ext.container.ButtonGroup',
		'Ext.layout.container.HBox'
	],
	
	cls : Ext.baseCSSPrefix + 'actions-bar',
	
	/**
	 * Component initialization
	 */
	initComponent: function()
	{
		var me = this;
		
		Ext.apply( me, {
			items  : me.createItems( me.actions ),
			layout : {
				type  : 'hbox',
				align : 'top'
			}
		});
		
		me.callParent( arguments );
	},
	
	createItems : function( actions )
	{
		var me = this;
		
		// array of items
		if( Ext.isArray( actions ) ) {
			var instances = [],
			    instance;
			
			for( var i = 0, il = actions.length; i < il; ++i ) {
				instance = me.createItems( actions[i] );
				
				if( instance ) {
					instances.push( instance );
				}
			}
			
			return instances.length > 0 ? instances : null;
		
		// completely defined item
		} else if( Ext.isObject( actions ) ) {
			var item = actions;
			
			switch( item.type ) {
				case 'group':
					return Ext.create( 'Ext.container.ButtonGroup', {
						title   : item.title,
						columns : item.columns || 1,
						items   : me.createItems( item.items )
					});
					
					break;
					
				case 'button':
					var action = me.dataBrowser.getAction( item.action );
					
					if( action != null ) {
						return action.createButton({
							text      : item.title,
							rowspan   : item.rowspan || 1,
							scale     : item.size || 'small',
							iconAlign : item.size == 'large' ? 'top' : 'left'
						});
						
					} else {
						return null;
					}
					
					break;
					
				case 'splitButton':
					var btnConfig = {
						xtype     : 'splitbutton',
						text      : item.title,
						rowspan   : item.rowspan || 1,
						scale     : item.size || 'small',
						iconAlign : item.size == 'large' ? 'top' : 'left',
						
						menu : {
							items : me.createItems( item.items )
						}
					};
					
					var action = me.dataBrowser.getAction( item.action );
					
					if( action != null ) {						
						return action.createButton( btnConfig );
						
					} else {
						return Ext.widget( btnConfig.xtype, btnConfig );
					}
					break;
			}
			
		// action shortcut
		} else {
			return me.createItems({
				type   : 'button',
				action : actions
			});
		}
	}
});