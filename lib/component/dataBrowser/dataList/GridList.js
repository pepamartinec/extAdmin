Ext.define( 'extAdmin.component.dataBrowser.dataList.GridList',
{
	extend : 'extAdmin.component.dataBrowser.AbstractDataBrowser',
	
	uses : [
		'Ext.selection.CheckboxModel'
	],
	
	/**
	 * Initializes component
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me      = this,
		    myCfg   = me.module.getViewConfig(),
		    listCfg = {};
		
		// create dataStore
		listCfg.store = me.createDataStore( Ext.Object.merge( {}, myCfg, {
			type  : 'Ext.data.Store'
		}) );
		
		// config columns
		var columns = listCfg.columns = [],
		    fields  = myCfg.fields,
		    field, column;
		
		for( var dataIdx in fields ) {
			field  = fields[ dataIdx ];
			column = {
				dataIndex : dataIdx
			};
			
			extAdmin.applyConfigIf( column, {
				header       : field.title,
				align        : field.align,
				width        : field.width,
				flex         : field.width ? false : true,
				sortable     : field.sortable,
				groupable    : field.groupable,
				hideable     : field.hideable || field.hidden,
				hidden       : field.hidden,
				menuDisabled : field.disableMenu
	//			editor    : field.editor,
	//			tpl       : field.tpl,
	//			tdCls     : field.tdCls,
	//			renderer  : field.renderer
			});
			
			switch( field.type ) {
				case 'date':
				case 'datecolumn':
				
				case 'datetime':
				case 'datetimecolumn':
					column.xtype = 'datecolumn';
					break;
					
				case 'currency':
				case 'currencycolumn':
					column.xtype = 'currencycolumn';
					
					if( field.currencyField ) {
						column.currencyField = field.currencyField;
					}
					break;
				
				case 'action':
				case 'actioncolumn':
					column.xtype          = 'dynamicactioncolumn';
					column.dataBrowser    = me;
					column.dataStore      = listCfg.store;
					column.allowedActions = field.items;
					break;
				
				default:
					if( field.type ) {
						column.type = field.type;
					}
					break;
			}
			
			columns.push( column );
		}
		
		// setup selection model
		switch( myCfg.selModel ) {
			case 'checkbox':
				listCfg.selType     = 'checkboxmodel';
				listCfg.multiSelect = true;
				break;
		}
		
		// setup summary
		if( myCfg.summary != null ) {
			var summary = Ext.create( 'Ext.Component', Ext.apply({
				dock  : 'bottom',
				cls   : 'footer'
			}, myCfg.summary ) );
			
			listCfg.dockedItems = [ summary ];
			
			listCfg.store.on( 'load', function( store ) {
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
		
		me.dataPanel = Ext.create( 'Ext.grid.Panel', listCfg );
		
		me.callParent( arguments );
		
		me.createActionAssets({
			panel      : me.dataPanel,
			dataView   : me.dataPanel.getView(),
			barActions : myCfg.barActions
		});
	},
	
	getActionsFactoryConfig : function()
	{
		var me = this,
		    sm = me.dataPanel.getSelectionModel();
		
		return {
			'module'      : {},
			'record'      : { getRecords  : Ext.Function.bind( sm.getSelection, sm ) },
			'dataBrowser' : { dataBrowser : this }
		};
	},
});