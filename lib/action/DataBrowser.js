Ext.define( 'extAdmin.action.DataBrowser',
{	
	extend : 'extAdmin.AbstractAction',
	
	/**
	 * DataBrowser
	 * 
	 * @protected
	 * @property {extAdmin.component.dataBrowser.DataBrowser} dataBrowser
	 */
	dataBrowser : null,
	
	/**
	 * Constructor
	 * 
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		me.dataBrowser = config.dataBrowser;
	}
});
