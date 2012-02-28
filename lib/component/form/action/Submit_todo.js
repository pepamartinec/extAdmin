Ext.define( 'extAdmin.action.form.Submit',
{	
	extend : 'extAdmin.component.form.AbstracrAction',
	
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