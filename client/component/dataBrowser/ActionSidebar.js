Ext.define( 'extAdmin.component.dataBrowser.ActionSidebar',
{
	extend : 'Ext.panel.Panel',
	
	requires : [
		'Ext.layout.container.Accordion',
		'Ext.layout.container.VBox'
	],
	
	/**
	 * Module instance
	 * 
	 * @cfg {extAdmin.Module}
	 */
	module : null,
	
	/**
	 * List of actions
	 * 
	 * @cfg {Array}
	 */
	actions : null,
	
	cls : 'action-sidebar',
	
	width : 100,
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this,
		    items = [],
		    action;
		
		for( var i = 0, al = me.actions.length; i < al; ++i ) {
			action = me.module.getAction( me.actions[ i ] );
			
			items.push( action.createButton({
				scale     : 'large',
				iconAlign : 'top',
				width     : me.width - 10,
				margin    : 5
			}) );
		}
		
		Ext.apply( me, {
			items : items
		});
		
		me.callParent( arguments );
	}
});
