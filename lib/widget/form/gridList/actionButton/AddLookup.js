Ext.define( 'extAdmin.widget.form.gridList.actionButton.AddLookup',
{
	extend : 'extAdmin.widget.form.gridList.AbstractAction',
	alias  : 'glaction.addlookup',
	
	texts : {
		title    : 'Přidat',
		tooltip  : 'Přidat novou položku'
	},
	
	/**
	 * Parent GridList
	 * 
	 * @cfg {extAdmin.widget.form.gridList.GridList} list
	 */
	list : null,
	
	/**
	 * Lookup popup instance
	 * 
	 * @private
	 * @property {extAdmin.popup.Lookup} popup
	 */
	popup : null,
	
	/**
	 * Action constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		Ext.applyIf( config, {
			iconCls : 'i-add',
			text    : me.texts.title,
			tooltip : me.texts.tooltip,
			
			handler : function()
			{				
				if( me.popup == null ) {
					me.popup = Ext.create( 'extAdmin.popup.Lookup', {
						closeAction : 'hide',
						
						/**
						 * Lookup component name
						 * 
						 * @cfg {String} lookup
						 */
						panel : config.lookup,
						
						/**
						 * Mapping between lookup and client data
						 * 
						 * @cfg {Object} mapping
						 */
						mapping : config.mapping,
						
						onSelection : me.onSelection,
						scope       : me
					});
				}
				
				me.popup.show();		
			}
		});
		
		me.callParent( arguments );
	},
	
	/**
	 * Lookup submit callback
	 * 
	 * @param {Array} items
	 */
	onSelection : function( items )
	{		
		this.list.grid.store.loadData( items, true );
	}
});