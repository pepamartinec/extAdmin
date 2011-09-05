Ext.define( 'extAdmin.widget.Form',
{
	extend : 'Ext.form.Panel',
	
	/**
	 * Initializes component
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		me.buttons = [];
		
		me.callParent();
	}
});