Ext.define( 'extAdmin.widget.form.gridList.AbstractAction',
{
	extend : 'Ext.Action',
	
	list : null,
	
	constructor : function( config )
	{
		var me = this;
		
		me.list = config.list;
		
		me.callParent( arguments );
	}
});