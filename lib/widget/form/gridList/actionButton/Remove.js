Ext.define( 'extAdmin.widget.form.gridList.actionButton.Remove',
{
	extend : 'extAdmin.widget.form.gridList.AbstractAction',
	alias  : 'glaction.remove',
	
	iconCls : 'i-delete',
	
	texts : {
		title    : 'Odebrat',
		tooltip  : 'Odebrat položku',
		popTitle : 'Potvrzení smazání',
		popText  : 'Opravdu chcete odstranit tuto položku?'
	},
	
	constructor : function( config )
	{
		var me = this;
		
		Ext.applyIf( config, {
			text    : me.texts.title,
			tooltip : me.texts.tooltip
		});
		
		me.callParent( arguments );
		me.scope = me;
	},
	
	handler : function( grid, rowIdx )
	{
		var me = this;
		
		Ext.MessageBox.confirm( me.texts.popTitle, me.texts.popText, function( btn ) {
			if( btn == 'ok' || btn == 'yes' ) {
				me.list.grid.getStore().removeAt( rowIdx );
			}
		});
	}
});