Ext.define( 'extAdmin.popup.Lookup',
{
	extend : 'extAdmin.popup.Base',
	
	requires : [
		'extAdmin.component.feature.Lookup'
	],
	
	/**
	 * Displayed content component
	 * 
	 * @cfg {Ext.Component}
	 */
	panel : null,
	
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
		
		// create lookup
		me.panel = me.createLookup();
		
		// init self
		me.callParent( arguments );
		
		// setup lookup mixin
		if( me.panel.isLookup !== true ) {
			Ext.Error.raise("Component '"+ me.panel.$className +"' does not implement extAdmin.component.feature.Lookup mixin");
		}
		
		var lm = me.panel.getLookupModel();
		lm.setSelectionMode( me.selectionMode );
		
		lm.on( 'selectionchange', function( selMode, selected ) {
			me.confirmBtn.setDisabled( me.selectionForce && selected.length == 0 );
		});
		
		me.confirmBtn.setDisabled( me.selectionForce && lm.hasSelection() == false );
	},
	
	/**
	 * Creates lookup component
	 * 
	 * @private
	 * @return {extAdmin.component.feature.Lookup}
	 */
	createLookup : function()
	{
		var me = this;
		
		if( Ext.isString( me.panel ) ) {
			me.panel = {
				ltype : me.panel
			};
		}
		
		Ext.applyIf( me.panel, {
			/**
			 * Mapping between lookup and client data
			 * 
			 * @cfg {Object}
			 */
			mapping : me.mapping,
			
			/**
			 * Items selection callback
			 * 
			 * @cfg {Function}
			 */
			onSelection : me.onSelection,
			
			/**
			 * Items selection callback scope
			 * 
			 * @cfg {Mixed}
			 */
			scope : me.scope
		});
		delete me.mapping;
		delete me.onSelection;
		delete me.scope;
		
		var alias;
		if( me.panel.ltype ) {
			alias = 'lookup.'+ me.panel.ltype;
			
		} else if( me.panel.xtype ) {
			alias = 'widget.'+ me.panel.xtype;
			
		} else if( me.panel.isComponent ) {
			return me.panel;
			
		} else {
			Ext.Error.raise({
				msg   : 'Panel is not compoment nor has ltype or xtype set',
				panel : me.panel
			});
		}
		
		return Ext.createByAlias( alias, me.panel );
	},
	
	/**
	 * Confirm button click handler
	 * 
	 * @protected
	 */
	confirm : function()
	{
		this.panel.confirmLookupSelection();		
		this.callParent();
	}
});