Ext.define( 'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsBar',
{
	extend : 'Ext.toolbar.Toolbar',

	requires : [
		'Ext.container.ButtonGroup',
		'Ext.layout.container.HBox'
	],
	
	cls : 'actions-bar',
	
	initComponent: function()
	{
		var me = this;
		
		Ext.apply( this, {
			items  : me.createItems( me.actions ),
			layout : {
				type  : 'hbox',
				align : 'top'
			}
		});
		
		this.callParent();
	},
	
	createItems : function( items )
	{
		var me = this;
		
		// array of items
		if( Ext.isArray( items ) ) {
			var instances = [],
			instance;
			
			for( var i = 0, il = items.length; i < il; ++i ) {
				instance = me.createItems( items[i] );
				
				if( instance ) {
					instances.push( instance );
				}
			}
			
			return instances.length > 0 ? instances : null;
		
		// completely defined item
		} else if( Ext.isObject( items ) ) {
			var item = items,
			    module = me.module;
			
			switch( item.type ) {
				case 'group':
					return Ext.create( 'Ext.container.ButtonGroup', {
						title   : item.title,
						columns : item.columns || 1,
						items   : me.createItems( item.items )
					});
					
					break;
					
				case 'button':
					var action = module.getAction( item.action );
					
					if( action != null ) {
						return action.createButton({
							text      : item.title,
							rowspan   : item.rowspan || 1,
							scale     : item.size || 'small',
							iconAlign : item.size == 'large' ? 'top' : 'left',
							
							records : function() {
								return me.selectionModel.getSelection();
							},
							
							beforeExecute      : me.beforeExecute,
							beforeExecuteScope : me.beforeExecuteScope,
							
							afterExecute      : me.afterExecute,
							afterExecuteScope : me.afterExecuteScope
						});
						
					} else {
						return null;
					}
					break;
			}
			
		// action shortcut
		} else {
			return me.createItems({
				type   : 'button',
				action : items
			});
		}
	}
});