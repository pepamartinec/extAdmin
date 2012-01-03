Ext.define( 'extAdmin.action.RecordAction',
{		
	extend : 'extAdmin.action.AbstractAction',
	
	/**
	 * @config {Boolean} multiRecord
	 */
	multiRecord : false,
	
	/**
	 * @config {extAdmin.action.feature.RecordProvider} dataProvider
	 */
	recordProvider : null,
	
	/**
	 * Constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		extAdmin.applyConfig( me, {
			multiRecord    : config.multiRecord,
			recordProvider : config.recordProvider
		});
	},
	
	/**
	 * Updates action state according to currently selected records
	 * 
	 */
	updateState : function()
	{
		var me         = this,
		    isDisabled = true,
		    records    = me.recordProvider.getActionRecords(),
		    activeNo   = 0;
		
		if( records.length > 0 && ( records.length == 1 || me.multiRow == true ) ) {	
			for( var i = 0, rl = records.length; i < rl; ++i ) {
				if( records[i].hasAction( me.name ) ) {
					++activeNo;
				}
			}
			
			isDisabled = activeNo !== records.length;
		}
		
		me.setDisabled( isDisabled );
	}
});
