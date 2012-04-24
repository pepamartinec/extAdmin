Ext.define( 'extAdmin.component.dataBrowser.view.Grid',
{
	extend : 'Ext.grid.Panel',
	mixins : {
		dataView : 'extAdmin.component.dataBrowser.DataViewFeature'
	},
	
	initComponent : function()
	{
		var me = this;
		
		me.configDataStore();
		me.configColumns();
		
		me.callParent();
		
		me.configActions( me.actions );
		
		// update active actions on items selection change
		me.getSelectionModel().on( 'selectionchange', me.updateActionsStates, me );
		me.updateActionsStates();
	},
	
	getSelection : function()
	{
		return this.getSelectionModel().getSelection();
	}
});