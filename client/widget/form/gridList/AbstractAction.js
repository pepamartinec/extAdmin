Ext.define( 'extAdmin.widget.form.gridList.AbstractAction',
{
	extend : 'Ext.Action',
	
	mixins: {
		observable: 'Ext.util.Observable'
	},
	
	list : null,
	
	constructor : function( config )
	{
		var me = this;
		
		me.list = config.list;
		
		me.callParent( arguments );
		
		me.mixins.observable.constructor.call( me, config );
	}
});