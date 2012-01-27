Ext.define( 'extAdmin.action.form.Submit',
{	
	extend : 'extAdmin.action.FormAction',
	
	texts : {
		title : 'Uložit'
	},
	
	iconCls  : 'i-save',
	
	handler : function( records )
	{
		var me = this;
		
		me.form.submit({
			success : function() {
				me.form.close();
			}
		});
	}
});