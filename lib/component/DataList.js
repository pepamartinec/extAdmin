/**
 * Abstract data list
 * 
 * @class extAdmin.panel.AbstractDataList
 */ 
Ext.define( 'extAdmin.component.DataList',
{
	extend : 'Ext.container.Container',
	
	requires : [
		'extAdmin.component.FiltersForm'
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
		
		var serverConfig = me.module.getServerConfig(),
		    items = [];
		
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
			me.filters = Ext.create( 'extAdmin.component.FiltersForm', {
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
			
			items.push( me.filters );
		}
			
		Ext.apply( me, {
			layout : 'border',
			items  : items
		});
		
		me.callParent();
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
	 * Applies given filter
	 * 
	 * @param {Object} filters
	 * @return {extAdmin.component.DataList}
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
	 * @return {extAdmin.component.DataList}
	 */
	reload : function()
	{
		this.dataList.getStore().load();
	}
});