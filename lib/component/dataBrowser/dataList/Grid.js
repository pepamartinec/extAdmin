Ext.define( 'extAdmin.component.dataBrowser.dataList.Grid',
{
	extend : 'extAdmin.widget.Grid',
	
	requires : [
		'Ext.selection.CheckboxModel'
	],

	/**
	 * Returns module default config
	 * 
	 * @return {Object}
	 */
	getDefaultConfig : function()
	{			
		return {
			grid : {
				columns    : [],
				barActions : [],
				rowActions : [],
				sort       : {
					column : 'ID',
					dir    : 'ASC'
				},
				selModel   : null
			}
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
		    config = extAdmin.component.dataBrowser.DataBrowser.pickServerConfig( me.module, me.getDefaultConfig() ).grid;
		
		// setup selection model
		switch( config.selModel ) {
			case 'checkbox':
				me.selModel = Ext.create( 'Ext.selection.CheckboxModel' );
				break;
		}
		    
		Ext.Object.merge( me, {
			columns     : config.columns,
			rowActions  : config.rowActions,
			barActions  : config.barActions,
			initialSort : {
				property  : config.sort.column,
				direction : config.sort.dir.toUpperCase()
			}
		});
		
		me.callParent();
	}
});