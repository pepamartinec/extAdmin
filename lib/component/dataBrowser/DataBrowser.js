Ext.define( 'extAdmin.component.dataBrowser.DataBrowser',
{
	extend : 'Ext.container.Container',
	
	requires : [
		'extAdmin.component.dataBrowser.Filters'
	],
	
	uses : [
		'extAdmin.component.dataBrowser.FiltersForm',
		'extAdmin.component.dataBrowser.ActionSidebar'
	],
	
	/**
	 * Module
	 * 
	 * @required
	 * @config {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * @required
	 * @config {Ext.Component} dataList
	 */
	dataList : null,
	
	/**
	 * @required
	 * @config {Ext.data.AbstractStore} store
	 */
	store : null,
	
	
	
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
	
	
	
	defaultConfig : {
		filters : {
			collapsed : false,
			items     : []
		},
		
		sidebar : null,
		
		barActions  : [],
		menuActions : [],
		rowActions  : [],
		sort        : {
			column : 'ID',
			dir    : 'ASC'
		},
		
		
		

	},
	
	/**
	 * View condtructor
	 * 
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		/**
		 * View config
		 * 
		 * @config {Object} view
		 */
//		me.mixins.dataList.constructor.call( me, {
//			serverConfig   : config.serverConfig,
//			serverDefaults : {
//				barActions  : [],
//				menuActions : [],
//				rowActions  : [],
//				sort        : {
//					column : 'ID',
//					dir    : 'ASC'
//				},
//				
//				
//				
//				filters : {
//					display   : false,
//					collapsed : false,
//					items     : []
//				},
//				
//				sidebar : null
//			}
//		});
		
		me.serverConfig = {};
		
		me.callParent( arguments );
	},
	
	secureServerConfig : function()
	{
		config = {
				serverDefaults : {
					barActions  : [],
					menuActions : [],
					rowActions  : [],
					sort        : {
						column : 'ID',
						dir    : 'ASC'
					}				
				},
				
				storeType    : 'Ext.data.Store',
				recordFields : [ 'name' ]
			};
			
			
			
			var me = this;
			
			// secure server config && apply defaults
			if( config.serverConfig !== undefined ) {
				if( config.serverDefaults !== undefined ) {
					me.config = me.mergeConfig( config.serverDefaults, config.serverConfig );
					
				} else {
					me.config = config.serverConfig;
				}
			}
	},
	
	
	// init actions
//	me.initActions({
//		barActions  : viewConfig.barActions,
//		rowActions  : viewConfig.rowActions,
//		menuActions : viewConfig.menuActions
//	});
//	
//	
//	// init dataBrowser actions
//	me.module.initActions( 'dataBrowser', { dataBrowser : me });
//	
//	
//	// init dataList actions
//	me.module.initActions( 'dataList', { dataBrowser : me });
//	
	/**
	 * Initializes component
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me    = this,
		    items = [];
		
		// init filters
	    me.filters = Ext.create( 'extAdmin.component.dataBrowser.Filters' );
		
	    
	    // tune dataList config
	    Ext.apply( me.dataList, {
	    	region : 'center'
	    });
	    
	    items.push( me.dataList );
	    
	    
		// init filters panel	    
		if( me.serverConfig.filters ) {
			// apply default config
			var filtersConfig = me.mergeConfig( me.serverConfig.filters, {
				collapsed : false,
				items     : []
			});
			
			me.filtersPanel = Ext.create( 'extAdmin.component.dataBrowser.FiltersForm', {
				region      : 'east',
				split       : true,
				collapsible : true,
				collapsed   : filtersConfig.collapsed,
				width       : 300,
				
				items       : filtersConfig.items,
				
				listeners : {
					scope : me,
					apply : me.applyFilters,
					reset : me.applyFilters
				}
			});
			
			me.filters.bindForm( filtersPanel.getForm() );
			items.push( filtersPanel );			
		}
		
		
		// init actionSidebar
		if( me.serverConfig.sidebar ) {
			// apply default config
			var sidebarConfig = me.mergeConfig( me.serverConfig.sidebar, {
				
			});
			
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
	 * Merges default and user config
	 * 
	 * @private
	 * @param  {Object|Null} defaultConfig
	 * @param  {Object|Null} userConfig
	 * @return {Object|Null}
	 */
	mergeConfig : function( userConfig, defaultConfig )
	{		
		if( defaultConfig == null ) {
			return null;
		}
		
		if( userConfig == null ) {
			return defaultConfig;
		}
		
		for( var name in defaultConfig ) {
			if( defaultConfig.hasOwnProperty( name ) === false ) {
				continue;
			}
			
			// item not present in userConfig
			if( userConfig.hasOwnProperty( name ) === false ) {
				continue;
				
			}
			
			defaultItem = defaultConfig[ name ];
			userItem    = userConfig[ name ];
			
			// item is not recursive (object)
			if( Ext.isObject( defaultItem ) === false ) {
				defaultConfig[ name ] = userItem;
			
			// item is recursive (object)
			} else {
				defaultConfig[ name ] = this.mergeConfig( userItem, defaultItem );
			}
		}
		
		return defaultConfig;
	},
	
	initActions : function( config )
	{
		var me = this;
		
		Ext.applyIf( config, {
			enableToolbar : true,
			enableMenu    : true
		});
		
//		// init actions
//		me.module.initActions( 'dataList', { dataList : me });
		
		// create actionsBar
		if( config.enableToolbar !== false ) {
			var barActions = config.barActions;
			
			// show all actions as default
			if( barActions == null ) {
				barActions = Ext.Object.keys( me.module.actions );
			}
			
			if( barActions.length > 0 ) {	
				var actionsBar = Ext.create( 'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsBar', {
					module         : me.module,
			    	selectionModel : me.getSelectionModel(),
			    	
					actions : barActions
				});
				
				me.addDocked( actionsBar );
			}
		}
		
		// create actionsMenu
		if( config.enableMenu !== false && config.menuActions ) {
			var actionsMenu = Ext.create( 'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsMenu', {
				module         : me.module,
		    	selectionModel : me.getSelectionModel(),
		    	
				actions  : config.menuActions,
				renderTo : Ext.getBody()
			});
			
			me.on( 'itemcontextmenu', function( view, record, node, index, event ) {
				event.stopEvent();
				actionsMenu.showAt( event.getXY() );
			} );
		}
		
		// init actionColumn
		var column;
		for( var i = 0, cl = me.columns.length; i < cl; ++i ) {
			column = me.columns[ i ];
			
			if( column.xtype == 'dynamicactioncolumn' ) {
				Ext.apply( column, {
					module         : me.module,
			    	selectionModel : me.getSelectionModel()
				});
			}
		}
		
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