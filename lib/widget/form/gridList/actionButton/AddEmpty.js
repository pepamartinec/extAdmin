Ext.define( 'extAdmin.widget.form.gridList.actionButton.AddEmpty',
{
	extend : 'extAdmin.widget.form.gridList.AbstractAction',
	alias  : 'glaction.addempty',
	
	texts : {
		title    : 'Přidat',
		tooltip  : 'Přidat novou položku'
	},
	
	constructor : function( config )
	{
		var me = this;
		
		Ext.applyIf( config, {
			iconCls : 'i-add',
			text    : me.texts.title,
			tooltip : me.texts.tooltip,
			handler : function() {
				me.list.grid.getStore().loadData( [{}], true );
			}		
		});
		
		me.callParent( arguments );
	}
});