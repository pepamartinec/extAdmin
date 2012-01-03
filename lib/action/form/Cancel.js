Ext.define( 'extAdmin.action.form.Cancel',
{	
	extend : 'extAdmin.action.FormAction',

	texts : {
		title : 'Storno'
	},
	
	iconCls : 'i-cancel',
	
	handler : function( records )
	{
		this.form.close();
	}
});