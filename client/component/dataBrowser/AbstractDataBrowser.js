Ext.define( 'extAdmin.component.dataBrowser.AbstractDataBrowser',
{
	extend : 'Ext.container.Container',

	requires : [
		'extAdmin.component.dataBrowser.Filters',
		'extAdmin.component.Model'
	],

	uses : [
		'extAdmin.component.dataBrowser.FiltersForm',
		'extAdmin.component.dataBrowser.ActionSidebar',
		'extAdmin.component.dataBrowser.action.*'
	],

	/**
	 * Module
	 *
	 * @required
	 * @cfg {extAdmin.Module} module
	 */
	module : null,

	/**
	 * View config
	 *
	 * @required
	 * @cfg {Object} viewConfig
	 */
	viewConfig : null,

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

		// apply filters, data gets loaded
		me.applyFilters();

		me.layout = 'border';
		me.callParent( arguments );
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
	applyFilters : function( cb, scope )
	{
		return this.filter( this.getFilters(), cb, scope );
	},

	/**
	 * Applies given filter
	 *
	 * @param  {Object} filters
	 * @return {extAdmin.component.dataBrowser.DataBrowser}
	 */
	filter : function( filters, cb, scope )
	{
		var me    = this,
		    store = me.dataPanel.getStore();

		var f = [];
		for( var name in filters ) {
			f.push({ property : name, value : filters[ name ] });
		}

		if( cb && Ext.isFunction( cb ) ) {
			store.on( 'load', {
				single : true,
				fn     : cb,
				scope  : scope
			});
		}

		store.clearFilter( true );
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
	 * Returns an array of the currently selected records.
	 *
	 * @return {extAdmin.Model[]}
	 */
	getSelection : function()
	{
		return this.dataPanel.getSelection();
	},

	/**
	 * Returns an array of the currently loaded records.
	 *
	 * @return {extAdmin.Model[]}
	 */
	getRecords : function()
	{
		return this.dataPanel.getStore().getRange();
	}
});