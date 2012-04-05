Ext.define( 'extAdmin.component.dataBrowser.browser.Tree',
{
	extend : 'extAdmin.component.dataBrowser.AbstractDataBrowser',
	
	requires : [
		'extAdmin.component.dataBrowser.view.Tree'
	],
	
	/**
	 * Initializes component
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		// create tree
		var treeConfig = Ext.apply( me.viewConfig, {
			module      : me.module,
			dataBrowser : me,
			actions     : me.module.getActionNames()
		});
		
		me.dataPanel = Ext.create( 'extAdmin.component.dataBrowser.view.Tree', treeConfig );
		
		me.callParent( arguments );
	}
});
