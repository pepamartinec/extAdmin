Ext.define( 'extAdmin.widget.Tree',
{
	extend : 'Ext.tree.Panel',

	requires : [
		'Ext.Error',
		'extAdmin.Model',
		'Ext.ModelManager',
		'inspirio.Store'
	],
	
	mixins : {
		actions : 'extAdmin.component.dataBrowser.dataList.feature.Actions'
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
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
				
		// create model & store
		var modelName = extAdmin.Model.createAnonymous( me, { fields : me.columns });
		delete me.columns;
		
		var store = me.module.createStore({
			type      : 'Ext.data.TreeStore',
			nodeParam : 'parentID',
			
			// TODO unify actions & data requests
			url    : me.loadAction ? { action : me.loadAction } : { request: 'data', part: 'tree' },
			params : me.loadParams,
			
			model         : modelName,
			implicitModel : true,
			autoLoad      : true
		});
		
		// init self
		Ext.Object.merge( me, {
			columns     : Ext.ModelManager.getModel( modelName ).prototype.columns,
			useArrows   : true,
			rootVisible : false,
			sortableColumns  : false,
			
			viewConfig : {
				toggleOnDblClick : false
			},
			
			store : store
		});
		
		me.callParent();
		
		// little hack to be able to filter on TreeStore
		me.store.filter = me.filterStore;
		
		// init actions
		me.initActions({
			enableToolbar : true,
			enableMenu    : true,
			rowActions    : me.rowActions,
			
			module         : me.module,
			selectionModel : me.getSelectionModel(),
			afterExecute   : function() {
				me.getStore().load();
			}
		});
	},
	
	/**
	 * Filter function for used TreeStore
	 * 
	 * @private
	 * @param filters
	 * @param value
	 */
	filterStore : function( filters, value )
	{
		var me = this;
		
		if( !me.remoteSort || !me.remoteFilter ) {
			return;
		}
		
        if( Ext.isString( filters ) ) {
            filters = {
                property: filters,
                value: value
            };
        }

        var decoded = me.decodeFilters( filters ),
            i = 0,
            length = decoded.length;

        for (; i < length; i++) {
            me.filters.replace( decoded[ i ] );
        }

        me.load();
	}
});