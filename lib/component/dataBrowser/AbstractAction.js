Ext.define( 'extAdmin.component.dataBrowser.AbstractAction',
{		
	extend : 'extAdmin.action.AbstractAction',
	
	requires : [
		'Ext.Error'
	],
	
	isPrototype : true,
	category    : 'dataBrowser',
	
	/**
	 * @config {Boolean} multiRecord
	 */
	multiRecord : false,
	
	/**
	 * @config {Boolean} dataDep
	 */
	dataDep : true,
	
	/**
	 * DataBrowser
	 * 
	 * @protected
	 * @property {extAdmin.component.dataBrowser.DataBrowser} dataBrowser
	 */
	dataBrowser : null,
	
	/**
	 * Action constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		//<debug>
		if( config.dataBrowser == null ) {
			Ext.Error.raise({
				msg    : 'Missing dataBrowser configuration',
				config : config
			});
		}
		//</debug>
		
		extAdmin.applyConfig( me, {
			multiRow    : config.multiRow,
			dataDep     : config.dataDep,
			dataBrowser : config.dataBrowser
		});
		
		if( me.dataDep ) {
			me.updateState = me.updateState_dataDep;
			
		} else {
			me.updateState = me.updateState_dataIndep;
		}
	},
	
	/**
	 * Checks whether the action can be launched with multiple records at once
	 * 
	 * @returns {Boolean}
	 */
	isMultiRecord : function()
	{
		return this.multiRecord;
	},
	
	/**
	 * Checks whether the action requires selected records to be launched
	 * 
	 * @returns {Boolean}
	 */
	isDataDependant : function()
	{
		return this.dataDep;
	},
	
	/**
	 * Updates action state according to current configuration
	 * 
	 * Version for data-independent version of action
	 */
	updateState_dataIndep : function()
	{
		this.setDisabled( false );
	},
	
	/**
	 * Updates action state according to current configuration
	 * 
	 * Version for data-dependent version of action
	 */
	updateState_dataDep : function()
	{
		var me         = this,
		    isDisabled = true,
		    records    = me.dataBrowser.getActionRecords(),
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
