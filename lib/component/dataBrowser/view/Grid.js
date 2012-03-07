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
		
		me.callParent( arguments );
		
		me.configActions( me.actions );
		
		// update active actions on items selection change
		me.getSelectionModel().on( 'selectionchange', me.updateActionsStates, me );
		me.updateActionsStates();
	},
	
	getActiveRecords : function()
	{
		return this.getSelectionModel().getSelection();
	}
});