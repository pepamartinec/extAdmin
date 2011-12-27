Ext.define( 'extAdmin.widget.Grid',
{
	extend : 'Ext.grid.Panel',

	requires : [
		'Ext.Error',
		'extAdmin.Model',
		'Ext.ModelManager'
	],
	
	mixins : {
		actions : 'extAdmin.component.dataBrowser.dataList.feature.Actions'
	},
	
	texts : {
		pagerBeforePage : 'Strana',
		pagerAfterPage  : 'z {0}',
		pagerRecordsTpl : 'Záznamy {0} - {1} z {2}',
		pagerEmpty      : 'Žádné záznamy nenalezeny'
	},
	
	/**
	 * Module
	 * 
	 * @required
	 * @cfg {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * Records load action name
	 * 
	 * @cfg {String} loadAction
	 */
	loadAction : null, // 'getRecords',
	
	/**
	 * Items load action parameters
	 * 
	 * @cfg {Object|Null} loadParams
	 */
	loadParams : null,
	
	/**
	 * Columns configuration
	 * 
	 * @reuired
	 * @cfg {Array} columns
	 */
	columns : null,
	
	/**
	 * Actions displayed in topBar
	 * 
	 * @cfg {Array|Null}
	 */
	rowActions : null,
	
	/**
	 * Table view configuration
	 */
	viewConfig: {
		getRowClass: function(record, rowIndex, rowParams, store){
			return record.get("rowClass");
		},
		stripeRows: false
	},
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
				
		// create model
		var modelName = extAdmin.Model.createAnonymous( me, { fields : me.columns });
		delete me.columns;
		
		var store = me.module.createStore({
			url    : me.loadAction ? { action : me.loadAction } : { request: 'data', part: 'grid' },
			params : me.loadParams,
			
			model         : me.model || modelName,
			implicitModel : true,
			sorters       : me.initialSort
		});
		
		// init self
		Ext.apply( me, {
			columns : Ext.ModelManager.getModel( modelName ).prototype.columns,
			
		    dockedItems: [{
		        xtype : 'pagingtoolbar',
		        store : store,
		        dock  : 'bottom',
		        
		        displayInfo : true,
		        beforePageText : me.texts.pagerBeforePage,
		        afterPageText  : me.texts.pagerAfterPage,
	            displayMsg  : this.texts.pagerRecordsTpl,
	            emptyMsg    : this.texts.pagerEmpty
		    }],
		    
			store : store
		});
		
		// setup initial sort state
//		var column;
//		for( var i = 0, cl = me.columns.length; i < cl; ++i ) {
//			column = me.columns[ i ];
//			
//			if( column.dataIndex === me.initialSort.property ) {
//				column.sortState = me.initialSort.direction;
//				break;
//			}
//		}
		

		me.callParent( arguments );

		// init actions
		me.initActions({
			enableToolbar : true,
			enableMenu    : true,
			barActions    : me.barActions,
			rowActions    : me.rowActions,
			
			module         : me.module,
			selectionModel : me.getSelectionModel(),
			afterExecute   : function() {
				me.getStore().load();
			}
		});
	}
});