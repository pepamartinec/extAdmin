Ext.define( 'extAdmin.component.dataList.feature.actions.ActionsMenu',
{
	extend : 'Ext.menu.Menu',
	
	initComponent: function()
	{
		var me = this,
		    items = [];
		
		// create buttons for specified actions
		for( var i = 0, al = me.actions.length; i < al; ++i ) {
			var actionName = me.actions[ i ],
			    action     = me.module.getAction( actionName );
			
			// skip delimiters and data independent actions
			if( action == null || action.dataDep == false ) {
				continue;
			}
			
			var button = action.createButton({
				records : function() {
					return me.selectionModel.getSelection();
				},
				
				beforeExecute : function() {
					me.beforeExecute.apply( me.beforeExecuteScope, arguments );
					me.hide();
				},
				
				afterExecute      : me.afterExecute,
				afterExecuteScope : me.afterExecuteScope
				
			}, 'Ext.menu.Item' );
			
			items.push( button );
		}
		
		Ext.apply( this, {
			padding : '1 10',
			items   : items
		});
		
		this.callParent();
	}
});