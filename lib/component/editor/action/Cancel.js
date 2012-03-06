Ext.define( 'extAdmin.component.editor.action.Cancel',
{	
	extend : 'extAdmin.component.editor.action.AbstractAction',
	
	texts : {
		title : 'Storno'
	},
	
	iconCls : 'i-cancel',
	
	handler : function( data )
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