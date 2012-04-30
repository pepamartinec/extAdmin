Ext.define( 'extAdmin.component.editor.action.Cancel',
{	
	extend : 'extAdmin.component.editor.action.AbstractAction',
	
	texts : {
		title : 'Storno'
	},
	
	iconCls : 'i-cancel',
	
	/**
	 * Returns parameters for handler function
	 *
	 * Cancel action do not need any data
	 * 
	 * @protected
	 * @returns {Array}
	 */
	getRunParams : function()
	{
		return [];
	},
	
	/**
	 * Action excution body
	 * 
	 * @protected
	 */
	run : function()
	{
		this.editor.viewRegion.close();
	},
	
	/**
	 * Updates action state according to currently selected records
	 * 
	 */
	updateState : function()
	{		
		me.setDisabled( false );
	}
});