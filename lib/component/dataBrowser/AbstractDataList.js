Ext.define( 'extAdmin.component.dataBrowser.AbstractDataList',
{
	extend : 'Ext.container.Container',
	
	requires : [
		'extAdmin.component.dataBrowser.Filters'
	],
	
	uses : [
		'extAdmin.component.dataBrowser.FiltersForm',
		'extAdmin.component.dataBrowser.ActionSidebar'
	],
	
	config : {
		/**
		 * Module
		 * 
		 * @required
		 * @config {extAdmin.Module} module
		 */
		module      : null,
		
		barActions  : null,
		menuActions : null,
		rowActions  : null,
		sort        : {
			column : 'ID',
			dir    : 'ASC'
		},
		
		filters : {
		    collapsed : false,
		    width     : 300,
		    items     : []
		},
		
		sidebar : {}
	},
		
	/**
	 * @protected
	 * @property {Ext.Component} dataList
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
	 * View constructor
	 * 
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.initConfig( config );
		
		config = Ext.apply( {}, config || {} );
		for( var idx in me.config ) {
			delete config[ idx ];
		}
		
		// init actions
		me.actions = me.module.factoryActions({
			'record' : {
				recordProvider : this
			},
			
			'dataBrowser' : {
				dataBrowser : this
			}
		});
		
		me.callParent([ config ]);
	},
	
	/**
	 * Initializes component
	 * 
	 * @private
	 */
	initComponent : function()
	{
		var me     = this,
		    config = me.config,
		    items  = me.items = [];
		
		// init filters
	    me.filters = Ext.create( 'extAdmin.component.dataBrowser.Filters' );
		
	    
	    // tune dataList config
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
		
		// apply filters, data gets loaded
		me.applyFilters();
		
		me.layout = 'border';
		me.callParent( arguments );
	},
	
	initActions : function( config )
	{
		var me     = this,
		    config = me.config;
		
//		// init actions
//		me.module.initActions( 'dataList', { dataList : me });
		
		// create actionsBar
		if( config.barActions ) {
			var barActions = config.barActions;
						
			if( Ext.isArray( barActions ) && barActions.length > 0 ) {	
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