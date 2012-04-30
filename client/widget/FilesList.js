Ext.define( 'extAdmin.widget.FilesList',
{
	extend : 'Ext.view.View',
	
	requires : [
		'Ext.XTemplate',
		'Ext.data.JsonStore'
	],
	
	statics : {		
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
	modelName : 'extAdmin.widget.FilesList.Model',
	
	/**
	 * Component intialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		// create dataStore
		me.store = me.module.createStore({
			url    : { action : me.loadAction },
			params : me.loadParams,
			
			model  : me.modelName
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
		
		me.callParent( arguments );
	}
	
}, function() {
	
	// define data model
	Ext.define( 'extAdmin.widget.FilesList.Model', {
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