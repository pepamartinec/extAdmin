Ext.define( 'extAdmin.action.form.Cancel',
{	
	extend : 'extAdmin.component.form.AbstracrAction',
	
	texts : {
		title : 'Storno'
	},
	
	iconCls : 'i-cancel',
	
	handler : function( records )
	{
		this.form.close();
	}
});