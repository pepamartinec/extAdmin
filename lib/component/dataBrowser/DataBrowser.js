/**
 * Abstract data list
 * 
 * @class extAdmin.panel.AbstractDataList
 */ 
Ext.define( 'extAdmin.component.dataBrowser.DataBrowser',
{
	extend : 'Ext.container.Container',
	
	requires : [
		'extAdmin.component.dataBrowser.Filters',
		'extAdmin.component.dataBrowser.FiltersForm',
		'extAdmin.component.dataBrowser.ActionSidebar'
	],
	
	statics : {
		/**
		 * Pick config from module
		 * 
		 * @param {extAdmin.Module} module
		 * @param {Object|Null} defaultConfig
		 * @returns {Object|Null}
		 */
		pickServerConfig : function( module, defaultConfig )
		{
			return this.mergeConfig( defaultConfig, module.getServerConfig() );
		},
		
		/**
		 * Merges module default and external config
		 * 
		 * @protected
		 * @param {Object|Null} defaultConfig
		 * @param {Object|Null} serverConfig
		 * @return {Object|Null}
		 */
		mergeConfig : function( localConfig, newConfig )
		{
			var me = this,
			    merged = {},
			    localItem, newItem;
			
			if( localConfig == null ) {
				return null;
			}
			
			if( newConfig == null ) {
				return localConfig;
			}
			
			for( var name in localConfig ) {
				if( localConfig.hasOwnProperty( name ) == false ) {
					continue;
				}
				
				localItem = localConfig[ name ];
				newItem  = newConfig[ name ];
				
				if( newItem === undefined ) {
					merged[ name ] = Ext.clone( localItem );
					
				} else if( Ext.isObject( localItem ) === false ) {
					merged[ name ] = Ext.clone( newItem );
					
				} else {
					merged[ name ] = me.mergeConfig( localItem, newItem );
				}
			}
			
			return merged;
		}
	},
	
	/**
	 * Module
	 * 
	 * @required
	 * @cfg {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * @protected
	 * @property {Object} serverConfig
	 */
	serverConfig : null,
	
	/**
	 * @protected
	 * @property {Ext.Component} dataList
	 */
	dataList : null,
	
	/**
	 * Filters panel
	 * 
	 * @protected
	 * @property {Ext.form.Panel} filters
	 */
	filters : null,
	
	/**
	 * DataBrowser dependent actions
	 * 
	 * @protected
	 * @property {Object} actions
	 */
	actions : null,
	
	/**
	 * Local filters
	 * 
	 * @private
	 * @property {Object}
	 */
	localFilters : null,
	
	/**
	 * Returns module default config
	 * 
	 * @protected
	 * @return {Object}
	 */
	getDefaultConfig : function()
	{
		return {
			filters : {
				display   : false,
				collapsed : false,
				items     : []
			},
			
			sidebar : null
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
		
		var serverConfig = me.serverConfig = me.module.getServerConfig(),
		    items = [];
		
		// FIXME remove this hard-coded workaround
		if( serverConfig['grid'] ) {
			serverConfig.views = { 'default' : serverConfig['grid'] };
			delete serverConfig['grid'];
			
		} else if( serverConfig['tree'] ) {
			serverConfig.views = { 'default' : serverConfig['tree'] };
			delete serverConfig['tree'];
			
		}
		
	    // init filters
	    me.filters = Ext.create( 'extAdmin.component.dataBrowser.Filters' );
		
		// init dataBrowser actions
		me.module.initActions( 'dataBrowser', {
			dataBrowser : me
		});
		
		
		
		// create main content area
		// workaround, so the 'center' component can be exchanged runtime
		me.centerArea = Ext.create( 'Ext.container.Container', {
			region : 'center',
			layout : 'fit',
			items  : []
		});
		
		items.push( me.centerArea );
		
		// init filters panel
		var filtersConfig = me.self.pickServerConfig( me.module, me.getDefaultConfig() ).filters;
		
		if( filtersConfig.display == true ) {
			var applyFilters = function() { me.applyFilters(); };
			
			var filtersPanel = Ext.create( 'extAdmin.component.dataBrowser.FiltersForm', {
				region      : 'east',
				split       : true,
				collapsible : true,
				collapsed   : filtersConfig.collapsed,
				width       : 300,
				
				items       : filtersConfig.items,
				
				listeners : {
					apply : applyFilters,
					reset : applyFilters
				}
			});
			
			me.filters.bindForm( filtersPanel.getForm() );
			items.push( filtersPanel );
		}
		
		// init actionSidebar
		var sidebar = me.self.pickServerConfig( me.module, me.getDefaultConfig() ).sidebar;
		if( sidebar != null ) {	    	
			me.actionSidebar = Ext.create( 'extAdmin.component.dataBrowser.ActionSidebar', {
				region      : 'west',
				vertical    : true,
				split       : false,
				collapsible : false,
				collapsed   : false,
				
				module  : me.module,
				actions : sidebar
			});
			
			items.push( me.actionSidebar );
		}
		
		Ext.apply( me, {
			layout : 'border',
			items  : items
		});
		
		// init dataList
		me.views = {};
		me.switchView( 'default' );
		
		// apply filters, data gets loaded
		me.applyFilters();
		
		me.callParent( arguments );
	},
	
	/**
	 * Return used module
	 * 
	 * @returns {extAdmin.Module}
	 */
	getModule : function()
	{
		return this.module;
	},
	
	/**
	 * Returns action
	 * 
	 * @param   {String} name
	 * @returns {extAdmin.AbstractAction}
	 */
	getAction : function( name )
	{
		return this.actions[ name ] || this.module.getAction( name );
	},
	
	/**
	 * Returns current state of dataList - selected records and applied filters
	 * 
	 * @returns {Object}
	 */
	getState : function()
	{
		return {
			filters   : me.dataList.store.filters,
			selection : me.getSelection()
		};
	},
	
	/**
	 * Returns selected records
	 * 
	 * @return {Array}
	 */
	getSelection : inspirio.abstractFn,
	
	/**
	 * Switches dataList view to supplied one
	 * 
	 * @param {String} viewName
	 */
	switchView : function( viewName, force )
	{
		var me = this,
		    viewInstances = me.views,
		    viewConfigs   = me.serverConfig.views,
		    view;
		
		if( viewInstances.hasOwnProperty( viewName ) ) {
			view = viewInstances[ viewName ];
			
		} else if( viewConfigs.hasOwnProperty( viewName ) ) {
			view = viewInstances[ viewName ] = Ext.create( me.serverConfig.type, {
				module     : me.module,
				viewConfig : viewConfigs[ viewName ]
			});
			
		} else {
			Ext.Error.raise({
				msg : 'Invalid view requested',
				viewName : viewName,
				views    : viewConfigs
			});
		}
		
		if( view === me.dataList && force !== true ) {
			return;
		}
		
		if( me.dataList ) {
			me.centerArea.remove( me.dataList, false );
		}
		
		me.centerArea.add( view );
		me.dataList = view;
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
	 */
	applyFilters : function()
	{
		this.filter( this.getFilters() );
	},
	
	/**
	 * Applies given filter
	 * 
	 * @param  {Object} filters
	 * @return {extAdmin.component.dataBrowser.DataBrowser}
	 */
	filter : function( filters )
	{
		var me = this,
		    store = me.dataList.getStore();
		
		var f = [];
		for( var name in filters ) {
			f.push({ property : name, value : filters[ name ] });
		}
		
		store.filters.clear();
		store.filter( f );
		
		return this;
	},
	
	/**
	 * Reloads dataList data
	 * 
	 * @return {extAdmin.component.dataBrowser.DataBrowser}
	 */
	reload : function()
	{
		this.dataList.getStore().load();
	}
});