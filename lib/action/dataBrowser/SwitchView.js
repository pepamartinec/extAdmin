Ext.define( 'extAdmin.action.dataBrowser.SwitchView',
{	
	extend : 'extAdmin.action.DataBrowser',
	
	params : {
		view : null // target view name
	},

	handler : function()
	{
		var me = this;
		
		me.dataBrowser.switchView( me.params.view );
	}
});
