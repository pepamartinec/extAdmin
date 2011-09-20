Ext.define( 'extAdmin.component.GalleryBrowser',
{
	extend : 'Ext.container.Container',
	
	requires : [
		'extAdmin.component.RepositoryBrowser',
		'extAdmin.ModuleManager',
		'extAdmin.widget.Tree'
	],
	
	alias : [
 		'widget.gallerybrowser',
 		'lookup.gallery'
 	],
	
	mixins : {
		lookup : 'extAdmin.component.feature.Lookup'
	},
	
	statics : {
		modelName : 'extAdmin.component.GalleryBrowser.Image'
	},
	
	/**
	 * Server module name
	 * 
	 * @cfg {String|extAdmin.Module} module
	 * @property {extAdmin.Module} module
	 */
	module : 'galleryBrowser',
	
	/**
	 * Album ID filter
	 * 
	 * @required
	 * @cfg {Integer}
	 */
	albumID : null,
	
	/**
	 * Locks predefined album and hides albums selector
	 * 
	 * @cfg {Boolean}
	 */
	disableAlbumChange : false,
	
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
	 * @property {extAdmin.widget.RepositoryBrowser} list
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
		me.list = Ext.create( 'extAdmin.component.RepositoryBrowser', {
			region : 'center', 
			
			multiSelect : me.multiSelect,
			module      : me.module,
			loadAction  : 'getAlbumImages',
			modelName   : me.self.modelName,
			
			uploadPopup : {
				module       : 'gallery',
				submitAction : 'uploadImages',
				submitParams : {
					albumID : me.albumID
				}
			}
		});
		
		me.items.push( me.list );
		
		// ====== TREE PANEL ======
		if( me.disableAlbumChange == false ) {
			me.tree = Ext.create( 'extAdmin.widget.Tree', {
				region      : 'west',
				width       : 200,
				collapsible : false,
				split       : true,
				
				module      : me.module,
				loadAction  : 'getAlbums',
				hideHeaders : true,

				columns : {
					title : { type : 'treecolumn' }
				},
				forceSelection : true
			});
			
			me.tree.on( 'selectionchange', me.onTreeNodeSelect, me );
			me.tree.getStore().on( 'load', me.onTreeReload, me );
			
			me.items.push( me.tree );
			
		} else {
			if( me.albumID == null ) {
				Ext.Error.raise( 'albumID must be set when disableAlbumChange is enabled' );
			}
			
			me.tree = null;
		}
		
		// ====== INIT SELF ======
		Ext.apply( me, {
			layout : 'border',
			buttons : [{
				text : 'reload',
				handler : function() { me.tree.getStore().load(); }
			}]
		});
		
		me.callParent( arguments );
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
		// find node with current albumID
		var me = this;
		    root = store.getRootNode(),
		    node = root.findChildBy( function( node ) {
		    	return node.getId() == me.albumID;
		    }, me, true );
		
		// highlight node & filter list-pane
		if( me.rendered ) {
			me.tree.getSelectionModel().select( node );
		}
		
		// expand ancestors
		while( node = node.parentNode ) {
			node.expand();
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
			property : 'albumID',
			value    : node.getId()
		});
	}
	
}, function() {
	
	// define data model
	Ext.define( 'extAdmin.component.GalleryBrowser.Image', {
		extend : 'extAdmin.Model',
		
		fields : [
			{ name : 'ID' },
			{ name : 'title' },
			{ name : 'filename' },
			{ name : 'thumbFilename' },
			{ name : 'xxlFilename' },
			
			// FIXME workaround, so we can use FilesList to display images
			{ name : 'thumb' },
		]
	});
	
});
