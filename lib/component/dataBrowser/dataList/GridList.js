Ext.define( 'extAdmin.component.dataBrowser.dataList.GridList',
{
	extend : 'Ext.grid.Panel',
	
	requires : [
		'extAdmin.Store'
	],
	
	uses : [
		'Ext.selection.CheckboxModel'
	],
	
	mixins : {
		dataList : 'extAdmin.component.dataBrowser.feature.DataList'
	},
	
	/**
	 * Component constructor
	 * 
	 * @param {Object}          serverConfig
	 * @param {extAdmin.Module} module
	 */
	constructor : function( serverConfig )
	{
		var me     = this,
		    config = {
				module  : serverConfig.module,
				columns : []
			};
		
		// apply config defaults
		serverConfig.loadAction = serverConfig.loadAction || 'loadListData';
		
		// create dataStore
		config.store = extAdmin.Store.createByServer({
			owner        : me,
			module       : serverConfig.module,
			type         : 'Ext.data.Store',
			serverConfig : serverConfig
		});
		
		// config columns
		var columns = config.columns,
		    column;
		
		for( var dataIdx in serverConfig.fields ) {
			item  = serverConfig.fields[ dataIdx ];
			column = {
				dataIndex : dataIdx
			};
			
			extAdmin.applyConfigIf( column, {
				header       : item.title,
				align        : item.align,
				width        : item.width,
				flex         : item.width ? false : true,
				sortable     : item.sortable,
				groupable    : item.groupable,
				hideable     : item.hideable || item.hidden,
				hidden       : item.hidden,
				menuDisabled : item.disableMenu
	//			editor    : item.editor,
	//			tpl       : item.tpl,
	//			tdCls     : item.tdCls,
	//			renderer  : item.renderer
			});
			
			switch( item.type ) {
				case 'date':
				case 'datecolumn':
				
				case 'datetime':
				case 'datetimecolumn':
					column.xtype = 'datecolumn';
					break;
					
				case 'currency':
				case 'currencycolumn':
					column.xtype = 'currencycolumn';
					
					if( item.currencyField ) {
						column.currencyField = item.currencyField;
					}
					break;
				
				default:
					if( item.type ) {
						column.type = item.type;
					}
					break;
			}
			
			columns.push( column );
		}
		
		// setup selection model
		switch( serverConfig.selModel ) {
			case 'checkbox':
				config.selType     = 'checkboxmodel';
				config.multiSelect = true;
				break;
		}
		
		// setup summary
		if( serverConfig.summary != null ) {
			var summary = Ext.create( 'Ext.Component', Ext.apply({
				dock  : 'bottom',
				cls   : 'footer'
			}, serverConfig.summary ) );
			
			config.dockedItems = [ summary ];
			
			config.store.on( 'load', function( store ) {
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
		
		me.callParent([ config ]);
	},
	
	/**
	 * Initializes component
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		me.callParent( arguments );
		
//		// init actions
//		me.initActions({
//			barActions  : viewConfig.barActions,
//			rowActions  : viewConfig.rowActions,
//			menuActions : viewConfig.menuActions
//		});
		
		me.store.load();
	}
});