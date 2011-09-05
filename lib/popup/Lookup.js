Ext.define( 'extAdmin.popup.Lookup',
{
	extend : 'extAdmin.popup.Base',
	
	requires : [
		'extAdmin.component.feature.Lookup',
		'Ext.Error'
	],
	
	/**
	 * Items selection callback
	 * 
	 * @cfg {Function}
	 */
	onSelection : Ext.emptyFn,
	
	/**
	 * Items selection callback scope
	 * 
	 * @cfg {Mixed}
	 */
	scope : null,
	
	/**
	 * Displayed content component
	 * 
	 * @cfg {Ext.Component}
	 */
	panel : null,
	
	/**
	 * Additional module parameters
	 * 
	 * @cfg {Object|Null}
	 */
	params : null,
	
	/**
	 * Items selection mode - single/multi
	 * 
	 * @cfg {String}
	 */
	selectionMode : 'multi',
	
	/**
	 * Forces user to select at least one item
	 * 
	 * @cfg {Boolean} selectionForce
	 */
	selectionForce : true,
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		Ext.applyIf( me, {
			width  : 800,
			height : 450
		});
		
		me.callParent();
		
		// setup lookup mixin
		if( me.panel.isLookup !== true ) {
			Ext.Error.raise("Component '"+ me.panel.$className +"' does not implement extAdmin.component.feature.Lookup mixin");
		}
		var selModel = me.panel.getSelectionModel();
		
		// setup selection type
		selModel.setSelectionMode( me.selectionMode );
		
		// setup submit button
		selModel.on( 'selectionchange', function( selMode, selected ) {
			me.confirmBtn.setDisabled( me.selectionForced && selected.length == 0 );
		});
		
		me.confirmBtn.setDisabled( me.selectionForced && selModel.hasSelection() == false );
	},
	
	/**
	 * Pushes current selection to client (via {@link #onSelection} callback)
	 * 
	 * @public
	 */
	pushSelection : function()
	{
		var me = this,
		    panel = me.panel,
		    selection = panel.getSelection();
		
		panel.getSelectionModel().deselectAll();
		
		Ext.callback( me.onSelection, me.scope, [ selection ] );
	},
	
	/**
	 * Confirm button click handler
	 * 
	 * @protected
	 */
	confirm : function()
	{
		this.pushSelection();
		
		this.callParent();
	}
});