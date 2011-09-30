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
		
		var serverConfig = me.module.getServerConfig(),
		    items = [];
		
	    // init filters
	    me.filters = Ext.create( 'extAdmin.component.dataBrowser.Filters' );
		
		// init dataBrowser actions
		me.module.initActions( 'dataBrowser', {
			dataBrowser : me
		});
		
		// init dataList
		me.dataList = Ext.create( serverConfig.type, {
			region : 'center',
			module : me.module
		});
		
		items.push( me.dataList );
		
		// init filters
		var filtersConfig = me.self.pickServerConfig( me.module, me.getDefaultConfig() ).filters,
		    applyFilters = function( values ) {
				me.filter( values );
			};
		
		if( filtersConfig.display == true ) {
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
			
			items.push( filtersPanel );
			me.filters.bindForm( filtersPanel.getForm() );
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
		
		// apply filters, data gets loaded
		me.applyFilters();
		
		me.callParent( arguments );
	},
	
	/**
	 * Initializes DataBrowser dependent actions
	 * 
	 * @private
	 */
	initActions : function()
	{
		var me = this,
		    actions = {};
	
		for( var actionName in actionsDefinitions ) {
			if( actionsDefinitions.hasOwnProperty( actionName ) === false ) {
				continue;
			}
				
			var definition = actionsDefinitions[ actionName ],
			    type       = inspirio.String.ucfirst( definition.type ),
			    className  = 'extAdmin.action.dataList.'+ type;
			
			if( Ext.ClassManager.get( className ) == false ) {
				Ext.Error.raise( 'Invalid action type "'+ type + '" for action "'+ actionName +'"' );
			}
			
			actions[ actionName ] = Ext.create( className, me, actionName, definition );	
		}
		
		me.actions = actions;
	},
	
	/**
	 * Returnd used module
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