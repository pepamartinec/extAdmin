Ext.define( 'extAdmin.component.editor.action.Save',
{	
	extend : 'extAdmin.component.editor.action.AbstractAction',
	
	texts : {
		title : 'Uložit'
	},
	
	iconCls  : 'i-disk',
	
	params : {
		autoClose : true
	},
	
	run : function( records )
	{
		var me = this;
		
		this.editor.saveData({
			success : me.params.autoClose ?
						function() { me.editor.viewRegion.close(); } :
						Ext.emptyFn
		});
	},
	
	/**
	 * Updates action state according to currently selected records
	 * 
	 */
	updateState : function()
	{		
		me.setDisabled( me.editor.validate() !== true );
	}
});