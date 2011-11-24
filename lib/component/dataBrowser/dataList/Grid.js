Ext.define( 'extAdmin.component.dataBrowser.dataList.Grid',
{
	extend : 'Ext.grid.Panel',
	
	requires : [
		'Ext.selection.CheckboxModel'
	],
	
	mixins : {
		dataList : 'extAdmin.component.dataBrowser.feature.DataList'
	},
	
	texts : {
		pagerBeforePage : 'Strana',
		pagerAfterPage  : 'z {0}',
		pagerRecordsTpl : 'Záznamy {0} - {1} z {2}',
		pagerEmpty      : 'Žádné záznamy nenalezeny'
	},
	
	/**
	 * View config
	 * 
	 * @config {Object} viewConfig
	 */
	viewConfig : null,

	/**
	 * Returns module default config
	 * 
	 * @return {Object}
	 */
	getDefaultConfig : function()
	{			
		return {
			columns     : [],
			barActions  : [],
			menuActions : [],
			rowActions  : [],
			sort        : {
				column : 'ID',
				dir    : 'ASC'
			},
			selModel    : null,
			summary     : null
		};
	},
	
	/**
	 * Initializes component
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		var viewConfig = me.secureConfig( me.viewConfig );
		delete me.viewConfig;
		
		// create model & dataStore
		var modelName = extAdmin.Model.createAnonymous( me, { fields : viewConfig.columns });
		
		me.store = me.module.createStore({
			url : { request: 'data', part: 'grid' },
			
			model         : modelName,
			implicitModel : true,
			sorters       : {
				property  : viewConfig.sort.column,
				direction : viewConfig.sort.dir
			}
		});
		
		// setup selection model
		switch( viewConfig.selModel ) {
			case 'checkbox':
				me.selType = 'checkboxmodel';
				me.multiSelect = true;
				break;
		}
		
		var dockedItems = [];
		
		// init pager
		dockedItems.push({
	        xtype : 'pagingtoolbar',
	        store : me.store,
	        dock  : 'bottom',
	        
	        displayInfo : true,
	        beforePageText : me.texts.pagerBeforePage,
	        afterPageText  : me.texts.pagerAfterPage,
            displayMsg  : this.texts.pagerRecordsTpl,
            emptyMsg    : this.texts.pagerEmpty
	    });
		
		// init summary
		if( viewConfig.summary !== null ) {
			var summary = Ext.create( 'Ext.Component', Ext.apply({
				dock  : 'bottom',
				cls   : 'footer'
			}, viewConfig.summary ) );
			
			dockedItems.push( summary );
			
			me.store.on( 'load', function( store ) {
				// ugly hack to fetch updated data
				// find a better way to update
				var rawData = store.getProxy().getReader().rawData,
				    summaryData = rawData.summary;
				
				if( summaryData ) {				
					summary.update( summaryData );
					me.doComponentLayout();
				}
			} );
		}
		
		// init self
		Ext.apply( me, {
			columns     : Ext.ModelManager.getModel( modelName ).prototype.columns,
		    dockedItems : dockedItems
		});		

		me.callParent( arguments );
		
		// init actions
		me.initActions({
			barActions  : viewConfig.barActions,
			rowActions  : viewConfig.rowActions,
			menuActions : viewConfig.menuActions
		});
	}
});