Ext.define( 'extAdmin.component.dataBrowser.dataList.Grid',
{
	extend : 'extAdmin.component.dataBrowser.AbstractDataBrowser',
	
	requires : [
		'extAdmin.component.dataView.Grid'
	],
	
	uses : [
		'Ext.selection.CheckboxModel',
		'Ext.Component',
		
		'Ext.grid.column.Date',
		'Ext.grid.column.Boolean',
		'Ext.grid.column.Number',
		'extAdmin.widget.grid.column.Currency',
		'extAdmin.component.dataView.actionDock.Column',
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
		    listCfg = {
				dataBrowser : me
			};
		
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
					column.dataStore      = listCfg.store;
					column.allowedActions = field.items;
					break;
				
				default:
					if( field.type ) {
						column.xtype = field.type;
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
		
		// setup actions
		listCfg.actions     = me.module.getActionNames();
		listCfg.barActions  = myCfg.barActions;
		listCfg.menuActions = myCfg.menuActions;
		
		// create grid
		me.dataPanel = Ext.create( 'extAdmin.component.dataView.Grid', listCfg );
		
		me.callParent( arguments );
	}	
});
