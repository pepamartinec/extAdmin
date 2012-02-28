Ext.define( 'extAdmin.component.dataBrowser.AbstractDataBrowser',
{
	extend : 'Ext.container.Container',
	
	requires : [
		'extAdmin.ActionManager',
		'extAdmin.component.dataBrowser.Filters',
		'extAdmin.component.dataBrowser.Model',
		
		'extAdmin.component.dataBrowser.action.Filter'
	],
	
	uses : [
		'extAdmin.component.dataBrowser.FiltersForm',
		'extAdmin.component.dataBrowser.ActionSidebar',
		'extAdmin.component.dataBrowser.actionDock.*'
	],
	
	mixins : {
		component : 'extAdmin.component.ComponentFeature'
	},

	/**
	 * Module
	 * 
	 * @required
	 * @config {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * @protected
	 * @property {Ext.Component} dataPanel
	 */
	dataPanel : null,	
	
	/**
	 * DataList filters
	 * 
	 * @protected
	 * @property {extAdmin.component.dataBrowser.Filters} filters
	 */
	filters : null,
	
	/**
	 * Filters panel
	 * 
	 * @protected
	 * @property {extAdmin.component.dataBrowser.FiltersForm} filtersPanel
	 */
	filtersPanel : null,
	
	/**
	 * Filters panel
	 * 
	 * @protected
	 * @property {extAdmin.component.dataBrowser.ActionSidebar} filtersPanel
	 */
	sidebar : null,
	
	/**
	 * Initializes component
	 * 
	 * @private
	 */
	initComponent : function()
	{
		var me     = this,
		    config = me.module.getViewConfig(),
		    items  = me.items = [];
		
		// init filters
	    me.filters = Ext.create( 'extAdmin.component.dataBrowser.Filters' );
		
	    
	    // tune dataPanel config
	    Ext.apply( me.dataPanel, {
	    	region : 'center'
	    });
	    
	    items.push( me.dataPanel );
	    
	    
		// init filters panel	    
		if( config.filters ) {
			var filtersConfig = config.filters;
			
			var filtersPanel = Ext.create( 'extAdmin.component.dataBrowser.FiltersForm', {
				region      : 'east',
				split       : true,
				collapsible : true,
				collapsed   : filtersConfig.collapsed,
				width       : filtersConfig.width,
				
				items       : filtersConfig.items,
				
				listeners : {
					scope : me,
					apply : me.applyFilters,
					reset : me.applyFilters
				}
			});
			
			items.push( filtersPanel );
			me.filtersPanel = filtersPanel;
			me.filters.bindForm( filtersPanel.getForm() );	
		}
		
		
		// init actionSidebar
		if( config.sidebar ) {
			var sidebarConfig = config.sidebar;
			
			me.actionSidebar = Ext.create( 'extAdmin.component.dataBrowser.ActionSidebar', {
				region      : 'west',
				vertical    : true,
				split       : false,
				collapsible : false,
				collapsed   : false,
				
				module  : me.module,
				actions : sidebarConfig
			});
			
			items.push( me.actionSidebar );
		}
		
		// setup component mixin
		me.factoryComponentActions();
		
		// apply filters, data gets loaded
		me.applyFilters();
		
		me.layout = 'border';
		me.callParent( arguments );
	},
	
	createActionAssets : function( config )
	{
		var me       = this,
		    panel    = config.panel,
		    dataView = config.dataView;
		
		// create action toolbar
		if( config.barActions ) {
			me.addActionToolbar( panel, {
				actions : config.barActions
			});
		}
		
		// create action menu
		if( config.enableMenu !== false && ( config.menuActions || config.barActions ) ) {
			me.addActionMenu( dataView, {
				actions : config.menuActions || config.barActions
			});
		}
		
		// update active actions on items selection change
//		dataView.getSelectionModel().on( 'selectionchange', me.updateActionsStates, me );
//		me.updateActionsStates();
//		
		return;

		
		// enable direct interaction with row
		if( config.rowActions ) {
			var rowActions = config.rowActions;
			
			// row dblClick
			if( rowActions.click ) {
				var clickAction = me.module.getAction( rowActions.click );
				
				if( clickAction ) {
					me.on( 'itemdblclick', function( view, record ) {
						if( clickAction.isDisabled() == false ) {
							clickAction.execute([ record ]);
						}
					} );
				}
			}
			
			// row key press
			if( rowActions['enter'] || rowActions['delete'] ) {
				var enterAction  = rowActions['enter']  ? me.module.getAction( rowActions['enter'] )  : null,
				    deleteAction = rowActions['delete'] ? me.module.getAction( rowActions['delete'] ) : null;
								
				me.getView().on( 'itemkeydown', function( view, record, row, index, event ) {
					var action = null;
					
					switch( event.getKey() ) {
						case Ext.EventObject.ENTER     : action = enterAction; break;
						case Ext.EventObject.DELETE    : action = deleteAction; break;
						case Ext.EventObject.BACKSPACE : action = deleteAction; break;
						default : return;
					}
					
					if( action.isDisabled() == false ) {
						var records = me.getSelectionModel().getSelection();
						
						action.execute( records );
					}
				});
			}
		}
		
		// update active actions on items selection change
		me.getSelectionModel().on( 'selectionchange', me.module.updateActionsStates, me.module );
		me.module.updateActionsStates();
	},
	
	/**
	 * Returns default dataStore config
	 * 
	 * @protected
	 * @return {Object}
	 */
	getStoreConfig : extAdmin.abstractFn,
	
	/**
	 * Creates list dataStore
	 * 
	 * @param {Object} storeCfg store config object
	 * @returns {Ext.data.AbstractStore}
	 */
	createDataStore : function( storeCfg )
	{
		var me = this;
		
		// model defined
		if( storeCfg.model ) {
			// we are fine, nothing to do
			
		// fields defined
		} else if( storeCfg.fields ) {
			Ext.apply( storeCfg, {			
				model         : extAdmin.component.dataBrowser.Model.create( storeCfg.fields ),
				implicitModel : true
			});
			
		// neither model nor fields defined
		} else {
			Ext.Error.raise({
				msg    : 'Model or fields configuration is missing',
				config : storeCfg
			});
		}
		
		Ext.applyIf( storeCfg, {			
			module : me.module
		});
		
		if( storeCfg.sort ) {
			var sort = storeCfg.sort;
			delete storeCfg.sort;
			
			storeCfg.sorters = {
				property  : sort.column,
				direction : sort.dir || 'asc'
			};
		}
		
		return extAdmin.Store.create( storeCfg );
	},
	
	/**
	 * Sets single filter value
	 * 
	 * Null value clears the filter
	 * 
	 * @param  {String} property
	 * @param  {Mixed}  value
	 * @return {extAdmin.component.dataBrowser.DataBrowser}
	 */
	setFilter : function( property, value )
	{
		this.filters.setValue( property, value );
		
		return this;
	},
	
	/**
	 * Returns single filter value
	 * 
	 * @param   {String} property
	 * @returns {Mixed}
	 */
	getFilter : function( property )
	{
		return this.filters.getValue( property );
	},
	
	/**
	 * Filters values setter
	 * 
	 * @param  {Object} values
	 * @return {extAdmin.component.dataBrowser.DataBrowser}
	 */
	setFilters : function( values )
	{
		this.filters.setValues( values );
		
		return this;
	},
	
	/**
	 * Filters values getter
	 * 
	 * @returns {Object}
	 */
	getFilters : function()
	{
		return this.filters.getValues();
	},
	
	/**
	 * Applies currently set filters
	 * 
	 * @return {extAdmin.component.dataBrowser.DataBrowser}
	 */
	applyFilters : function()
	{
		return this.filter( this.getFilters() );
	},
	
	/**
	 * Applies given filter
	 * 
	 * @param  {Object} filters
	 * @return {extAdmin.component.dataBrowser.DataBrowser}
	 */
	filter : function( filters )
	{
		var me    = this,
		    store = me.dataPanel.getStore();
		
		var f = [];
		for( var name in filters ) {
			f.push({ property : name, value : filters[ name ] });
		}
		
		store.filters.clear();
		store.filter( f );
		
		return this;
	},
	
	/**
	 * Reloads dataPanel data
	 * 
	 * @return {extAdmin.component.dataBrowser.DataBrowser}
	 */
	reload : function()
	{
		this.dataPanel.getStore().load();
	},
	
	/**
	 * Notification about record data change
	 * 
	 * @param {Number} recordId
	 */
	recordChangeNotification : function( recordId )
	{
		console.warn( 'Implementation of selective record update is still missing' );
		this.reload();
	}
	
});