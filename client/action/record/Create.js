Ext.define( 'extAdmin.action.record.Create',
{	
	extend : 'extAdmin.action.record.Edit',
	
	dataDep  : false,	
	iconCls  : 'i-application-form-add',
	
	/**
	 * Constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		// handle data independent action variant
		if( config.dataDep !== true ) {
			me.updateState = me.updateState_dataIndep;
		}
		
		me.callParent( arguments );
	},
	
	/**
	 * Action state updater for dataIndependent variant
	 * 
	 */
	updateState_dataIndep : function()
	{		
		this.setDisabled( false );
	}
});
