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
	},

	/**
	 * Records change notification callback
	 *
	 * Should be called by actions when some records were changed
	 *
	 * @param {Object} changes Changes list
	 * @param {Number[]} [changes.created] List of newly created record IDs
	 * @param {Number[]} [changes.updated] List of updated record IDs
	 * @param {Number[]} [changes.deleted] List of deleted record IDs
	 */
	notifyRecordsChange : function( changes )
	{
		this.getStore().load();
	}
});