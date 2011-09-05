Ext.define( 'extAdmin.component.dataList.feature.actions.ActionsBar',
{
	extend : 'Ext.toolbar.Toolbar',

	requires : [
		'Ext.Error'
	],
	
	cls : 'actions-bar',
	
	initComponent: function()
	{
		var me = this,
		    items = [];
		
		// create buttons for specified actions
		for( var i = 0, al = me.actions.length; i < al; ++i ) {
			var actionName = me.actions[ i ];
			
			// skip delimiters
			if( actionName == '|' || actionName == '->' || actionName == ' ' ) {
				items.push( actionName );
			
			} else {
				var action = me.module.getAction( actionName );
				
				// check whether action exists
				if( action === undefined ) {
					Ext.Error.raise( "Invalid action '"+ actionName +"'" );
				}
				
				// create button
				var button = action.createButton({
					records : function() {
						return me.selectionModel.getSelection();
					},
					
					beforeExecute      : me.beforeExecute,
					beforeExecuteScope : me.beforeExecuteScope,
					
					afterExecute      : me.afterExecute,
					afterExecuteScope : me.afterExecuteScope
				});
				
				items.push( button );				
			}
		}
		
		Ext.apply( this, {
			items : items
		});
		
		this.callParent();
	}
});