Ext.define( 'extAdmin.component.dataBrowser.browser.Grid',
{
	extend : 'extAdmin.component.dataBrowser.AbstractDataBrowser',
	
	requires : [
		'extAdmin.component.dataBrowser.view.Grid'
	],
	
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
		var me = this;

//		
//		// setup selection model
//		switch( myCfg.selModel ) {
//			case 'checkbox':
//				listCfg.selType     = 'checkboxmodel';
//				listCfg.multiSelect = true;
//				break;
//		}
		
//		// setup summary
//		if( myCfg.summary != null ) {
//			var summary = Ext.create( 'Ext.Component', Ext.apply({
//				dock  : 'bottom',
//				cls   : 'footer'
//			}, myCfg.summary ) );
//			
//			listCfg.dockedItems = [ summary ];
//			
//			listCfg.store.on( 'load', function( store ) {
//				// ugly hack to fetch updated data
//				// find a better way to update
//				var rawData = store.getProxy().getReader().rawData,
//				    summaryData = rawData.summary;
//				
//				if( summaryData ) {				
//					summary.update( summaryData );
//					me.doComponentLayout();
//				}
//			} );
//		}
		
		// create grid
		var gridConfig = Ext.apply( me.viewConfig, {
			module      : me.module,
			dataBrowser : me,
			actions     : me.module.getActionNames()
		});
		
		me.dataPanel = Ext.create( 'extAdmin.component.dataBrowser.view.Grid', gridConfig );
		
		me.callParent( arguments );
	}	
});
