Ext.define( 'extAdmin.action.record.AbstractAction',
{		
	extend : 'extAdmin.action.AbstractAction',
	
	isPrototype : true,
	category    : 'record',
	
	/**
	 * @config {Boolean} multiRecord
	 */
	multiRecord : false,
	
	/**
	 * @config {extAdmin.component.feature.DataView} dataView
	 */
	dataView : null,
	
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
			multiRecord : config.multiRecord,
			dataView    : config.dataView
		});
	},
	
	/**
	 * Returns parameters for handler function
	 * 
	 * @protected
	 * @returns {Array}
	 */
	getHandlerParams : function()
	{
		return [ this.dataView.getActiveRecords() ];
	},
	
	/**
	 * Updates action state according to currently selected records
	 * 
	 */
	updateState : function()
	{
		var me         = this,
		    isDisabled = true,
		    records    = me.dataView.getActiveRecords(),
		    activeNo   = 0;
		
		if( records.length > 0 && ( records.length == 1 || me.multiRow == true ) ) {	
			for( var i = 0, rl = records.length; i < rl; ++i ) {
				if( records[i].hasAction( me.name ) ) {
					++activeNo;
				}
			}
			
			isDisabled = ( activeNo !== records.length );
		}
		
		me.setDisabled( isDisabled );
	}
});
