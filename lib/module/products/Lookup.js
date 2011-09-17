Ext.define( 'extAdmin.module.products.Lookup',
{
	extend : 'Ext.container.Container',
	
	requires : [
		'extAdmin.ModuleManager',
		'extAdmin.widget.Grid',
		'extAdmin.widget.Tree',
		'extAdmin.module.products.model.Product'
	],
	
	alias : [
		'widget.module.products.lookup',
		'lookup.products'
	],
	
	mixins : {
		lookup : 'extAdmin.component.feature.Lookup'
	},
	
	statics : {
		categoryModelName : 'extAdmin.module.products.Lookup.Category',
		productModelName : 'extAdmin.module.products.Lookup.Product'
	},
	
	texts : {
		titleCol : 'Název'
	},
	
	/**
	 * Server module name
	 * 
	 * @cfg {String|extAdmin.Module} module
	 * @property {extAdmin.Module} module
	 */
	module : 'productsBrowser',
	
	/**
	 * Category ID filter
	 * 
	 * @cfg {Integer}
	 */
	categoryID : null,
	
	/**
	 * Allows selecting more images at one time
	 * 
	 * @cfg {Boolean}
	 */
	multiSelect : true,
	
	/**
	 * Albums tree
	 * 
	 * @readonly
	 * @property {extAdmin.Widget.Tree} tree
	 */
	tree : null,
	
	/**
	 * Images list
	 * 
	 * @readonly
	 * @property {extAdmin.widget.Grid} list
	 */
	list : null,
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		me.module = extAdmin.ModuleManager.get( me.module );
		me.items  = [];
		
		// ====== LIST PANEL ======		
		me.list = Ext.create( 'extAdmin.widget.Grid', {
			region : 'center', 
			
			multiSelect : me.multiSelect,
			module      : me.module,
			loadAction  : 'loadProducts',
			model       : 'extAdmin.module.products.model.Product',
			columns     : {
				ID    : { title : '#' },
				title : { title : me.texts.titleCol }
			}
		});
		
		me.items.push( me.list );
		
		// ====== TREE PANEL ======
		me.tree = Ext.create( 'extAdmin.widget.Tree', {
			region      : 'west',
			width       : 200,
			collapsible : false,
			split       : true,
			
			hideHeaders    : true,
			forceSelection : true,
			
			module     : me.module,
			loadAction : 'loadCategories',
			columns    : {
				title : { type : 'treecolumn' }
			}
		});
		
		me.tree.on( 'selectionchange', me.onTreeNodeSelect, me );
		me.tree.getStore().on( 'load', me.onTreeReload, me );
		
		me.items.push( me.tree );
		
		// ====== INIT SELF ======
		Ext.apply( me, {
			layout  : 'border',
			buttons : [{
				text : 'reload',
				handler : function() { me.tree.getStore().load(); }
			}]
		});
		
		me.callParent();
		me.mixins.lookup.constructor.call( me, {
			selModel : me.list.getSelectionModel()
		});
	},

	/**
	 * Tree reload callback
	 * 
	 * @private
	 * @param {Ext.data.Store} store
	 */
	onTreeReload : function( store )
	{
		
		var me = this;
		
		if( me.categoryID ) {
			// find node with current categoryID	
			var root = store.getRootNode(),
			    node = root.findChildBy( function( node ) {
			    	return node.getId() == me.categoryID;
			    }, me, true );
			
			// highlight node & filter list-pane
			if( me.rendered ) {
				me.tree.getSelectionModel().select( node );
			}
			
			// expand ancestors
			while( node = node.parentNode ) {
				node.expand();
			}
		}
	},
	
	/**
	 * Album selection callback
	 * 
	 * @private
	 * @param {Ext.view.View} view
	 * @param {Array} selection
	 */
	onTreeNodeSelect : function( view, selection )
	{
		var me = this,
		    node = selection[0];
		
		if( node == null ) {
			return;
		}
		
		me.albumID = node.getId();
		
		var store = me.list.getStore();
		
		store.filters.clear();
		store.filter({
			property : 'categoryID',
			value    : node.getId()
		});
	}
	
});