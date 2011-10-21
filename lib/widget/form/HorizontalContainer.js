Ext.define( 'extAdmin.widget.form.HorizontalContainer',
{
	extend : 'Ext.container.Container',
	
	alias : 'widget.hfbox',
	
	initComponent : function()
	{
		var me = this;
		
		if( Ext.isArray( me.items ) !== true ) {
			me.items = [ me.items ];
		}
		
		Ext.apply( me, {
			layout : {
				type : 'hbox'
			}
		});
		
		var item;
		for( var i = 0, il = me.items.length; i < il; ++i ) {
			item = me.items[i];
			
			if( item.flex === undefined ) {
				item.flex = 1;
			}
			
			if( i > 0 ) {
				item.labelAlign = 'right';
			}
		}
		
		me.callParent( arguments );
	},
	
	setDisabled : function( disabled )
	{
		var items = this.items.items;
		
		for( var i = 0, il = items.length; i < il; ++i ) {
			items[i].setDisabled( disabled );
		}
	}
});