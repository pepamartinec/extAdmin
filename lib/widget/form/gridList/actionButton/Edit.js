Ext.define( 'extAdmin.widget.form.gridList.actionButton.Edit',
{
	icon : 'images/administration/icons/edit.png',
	
	texts : {
		tooltip  : 'Upravit položku'
	},
	
	constructor : function( handler, scope )
	{
		var me = this;
		
		me.tooltip = me.texts.tooltip;
		me.scope   = scope;
		me.handler = handler;
	}
});
