Ext.define( 'extAdmin.action.record.Server',
{
	extend : 'extAdmin.action.record.AbstractAction',
	
	multiRecord : false,
	dataDep     : false,
	
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
	},
	
	run : function( records )
	{
		var me = this;
		
		me.module.runAction( me.name );
	}
});