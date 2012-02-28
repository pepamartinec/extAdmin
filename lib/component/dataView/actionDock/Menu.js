Ext.define( 'extAdmin.component.dataView.actionDock.Menu',
{
	extend : 'Ext.menu.Menu',
	
	/**
	 * @cfg {String[]}
	 */
	actions : null,
	
	/**
	 * @cfg {extAdmin.component.AbstractDataBrowser}
	 */
	dataBrowser : null,
	
	/**
	 * Component initialization
	 * 
	 */
	initComponent: function()
	{
		var me      = this,
		    browser = me.dataBrowser,
		    items   = [];
		
		Ext.Array.forEach( me.actions, function( actionName ) {
			var action = browser.getAction( actionName );
			
			if( action == null ) {
				return;
			}
			
			var button = action.createButton( {}, 'Ext.menu.Item' );
			
			Ext.Function.createInterceptor( button.handler, function() {
				this.hide();
			}, me );
			
			items.push( button );
		});
		
		Ext.apply( me, {
			padding : '1 10',
			items   : items
		});
		
		me.callParent( arguments );
	}
});