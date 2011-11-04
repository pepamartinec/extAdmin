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
			selModel    : null
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
			implicitModel : true
		});
		
		// setup selection model
		switch( viewConfig.selModel ) {
			case 'checkbox':
				me.selType = 'checkboxmodel';
				me.multiSelect = true;
				break;
		}
		
		// init self
		Ext.apply( me, {
			columns  : Ext.ModelManager.getModel( modelName ).prototype.columns,
			
		    dockedItems: [{
		        xtype : 'pagingtoolbar',
		        store : me.store,
		        dock  : 'bottom',
		        
		        displayInfo : true,
		        beforePageText : me.texts.pagerBeforePage,
		        afterPageText  : me.texts.pagerAfterPage,
	            displayMsg  : this.texts.pagerRecordsTpl,
	            emptyMsg    : this.texts.pagerEmpty
		    }]
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