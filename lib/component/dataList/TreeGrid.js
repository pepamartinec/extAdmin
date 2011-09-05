Ext.define( 'extAdmin.component.dataList.TreeGrid',
{
	extend : 'Ext.container.Container',
	
	requires : [
	    'Ext.container.Container',
		'extAdmin.widget.Tree',
		'extAdmin.widget.Grid',
	],
	
	statics : {
		/**
		 * Returns module default config
		 * 
		 * @return {Object}
		 */
		getDefaultConfig : function()
		{			
			return Ext.apply( extAdmin.component.AbstractDataList.getDefaultConfig(), {
				tree : {
					loadAction : 'loadTreeData',
					columns    : [],
					parentRel  : 'parentID'
				},
				
				grid : {
					loadAction : 'loadGridData',
					columns    : [],
					barActions : [],
					rowActions : []
				}
			});
		}
	},
	
	/**
	 * DataList initialization
	 * 
	 * @protected
	 * @param {Object} dlConfig dataList config
	 * @return {Ext.Component}
	 */
	initDataList : function( dlConfig )
	{
		var me = this;
		
		var gridConf = me.serverConfig.grid,
		    treeConf = me.serverConfig.tree;
		
		
		var grid = Ext.create( 'extAdmin.widget.Grid' , Ext.apply({
			region     : 'center',
			module     : me.module,
			
			loadAction : gridConf.loadAction,
			columns    : gridConf.columns,
			rowActions : gridConf.rowActions,
			barActions : gridConf.barActions
			
		}, dlConfig.grid || {} ));
		
		delete dlConfig.grid;
		
		var tree = Ext.create( 'extAdmin.widget.Tree', Ext.apply({
			region     : 'west',
			module     : me.module,
			
			loadAction : treeConf.loadAction,
			columns    : gridConf.columns,
			
			listeners : {
				selectionchange : function( view, selection ) {
					if( selection.length === 0 ) {
						// cancel category-filter
						
					} else {
						var filters = {};
						filters[ treeConfig.parentRel ] = selection[0].getId();
						
						grid.filter( filters );
					}
				}
			}
		}, dlConfig.tree || {} ));
		
		delete dlConfig.tree;
		
		// setup tree
		me.dataList = Ext.create( 'Ext.container.Container', Ext.apply( dlConfig || {}, {
			layout : 'border',
			items  : [ grid, tree ]
		}));
	}
});