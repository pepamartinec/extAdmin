Ext.define( 'extAdmin.widget.FilesList',
{
	extend : 'Ext.view.View',
	
	requires : [
		'Ext.XTemplate',
		'Ext.data.JsonStore'
	],
	
	statics : {
		/**
		 * @private
		 * @property {String} modelName
		 */
		modelName : 'extAdmin.widget.FilesList.Model',
		
		/**
		 * Default handler module name
		 * 
		 * @cfg {String}
		 */
		defaultModule : 'repository',
		
		/**
		 * Default items load action name
		 * 
		 * @cfg {String}
		 */		
		defaultAction : 'getItems'
	},
	
	texts : {
		noItems     : 'Složka je prázdná',
		loadingText : 'Načítám...',
	},
	
	/**
	 * Module
	 * 
	 * @cfg {extAdmin.Module|Null} module
	 */
	module : null,
	
	/**
	 * Items load action name
	 * 
	 * @cfg {String|Null} submitAction
	 */
	loadAction : null,
	
	/**
	 * Items load action parameters
	 * 
	 * @cfg {Object|Null} submitParams
	 * @property {Object|Null} submitParams
	 */
	loadParams : null,
	
	/**
	 * Allows selecting more items at one time
	 * 
	 * @cfg {Boolean}
	 */
	multiSelect : true,
	
	/**
	 * When supplied, the itemModel is used as model for returned items
	 * 
	 * @cfg {String|Null}
	 */
	itemModelName : null,
	
	/**
	 * Component intialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		var modelName = me.self.modelName;
		if( me.itemModelName != null ) {			
			modelName = extAdmin.Model.createAnonymous( me, {
				extend  : modelName,
				hasMany : { model : me.itemModelName, name : 'detail' }
			});
		}
		
		// create dataStore
		me.store = me.module.createStore({
			url    : { action : me.loadAction },
			params : me.loadParams,
			
			model  : modelName
		});
		
		// ====== INIT SELF ======
		Ext.apply( me, {
			store : me.store,
			cls   : 'repository-view',
			tpl   : Ext.create('Ext.XTemplate',
				'<tpl for=".">',
					'<div class="item-wrap" id="{ID}" title="{title}">',
						'<div class="thumb"><img src="{thumb}" title="{title}" /></div>',
						'<span>{title}</span>',
					'</div>',
				'</tpl>',
				'<div class="x-clear"></div>'
			),
			
			autoScroll   : true,
			multiSelect  : me.multiSelect,
			singleSelect : true,
			
			overItemCls  : 'x-item-over',
			itemSelector : 'div.item-wrap',
			
			loadingText  : me.texts.loadingText,
			emptyText    : me.texts.noItems,			
			
			//plugins      : this.multiSelect ? [ new Ext.DataView.DragSelector() ] : []
		});
		
		me.callParent();
	},
	
	/**
	 * Returns selected records
	 * 
	 * @return {Array}
	 */
	getSelection : function()
	{
		var me = this,
		    selection = me.getSelectionModel().getSelection();
		
		if( me.itemModelName == null ) {
			return selection;
		}
		
		var items = [];
		for( var i = 0, sl = selection.length; i < sl; ++i ) {
			items.push( selection[ i ].detail().getAt( 0 ) );
		}
		
		return items;
	}
	
}, function() {
	
	// define data model
	Ext.define( this.modelName, {
		extend : 'extAdmin.Model',
		
		fields : [
			{ name : 'ID' },
			{ name : 'title' },
			{ name : 'mimeType' },
			{ name : 'href' },
			{ name : 'thumb' }
		]
	});
	
});