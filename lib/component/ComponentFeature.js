Ext.define( 'extAdmin.component.ComponentFeature',
{
	uses : [
		'extAdmin.component.dataBrowser.actionDock.Toolbar',
		'extAdmin.component.dataBrowser.actionDock.Column'
	],
	
	/**
	 * @config {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * @config {Object}
	 */
	actions : null,
	
	/**
	 * 
	 */
	getActionsFactoryConfig : extAdmin.abstractFn,
	
	/**
	 * 
	 * 
	 * @param {Array|null} actions
	 */
	factoryComponentActions : function()
	{
		var me = this;
		
		me.actions = me.module.factoryActions( me.getActionsFactoryConfig() );
	},
	
	/**
	 * Returns action instance
	 * 
	 * @param {String} name
	 * @returns {extAdmin.action.AbstractAction|null}
	 */
	getAction : function( name )
	{
		return this.actions[ name ] || null;
	},
	
	/**
	 * Updates actions states
	 * 
	 * @public
	 */
	updateActionsStates : function()
	{
		var actions = this.actions;
		
		for( var aName in actions ) {
			actions[ aName ].updateState();
		}
	},
	
	/**
	 * Creates action toolbar
	 * 
	 * @protected
	 * 
	 * @param {Ext.panel.AbstractPanel} panel A panel into which dock the toolbar
	 * @param {Object} config A toolbar config object
	 * @param {String[]} [config.actions] A list of module action names to display in toolbar
	 * @param {String}   [config.dataBrowser=this] An optional dataBrowser instance
	 * @param {String}   [config.dock=top] An optional toolbar position
	 * @returns {extAdmin.component.dataBrowser.actionDock.Toolbar}
	 */
	addActionToolbar : function( panel, config )
	{
		Ext.applyIf( config, {
			dock        : 'top',
			dataBrowser : this
		});
		
		if( panel.dockedItems == null ) {
			panel.dockedItems = [];
		}
		
		panel.addDocked( Ext.create( 'extAdmin.component.dataBrowser.actionDock.Toolbar', config ) );
	},
	
	/**
	 * Creates action menu
	 * 
	 * @protected
	 * 
	 * @param {Array} actions
	 * @returns {extAdmin.component.dataBrowser.actionDock.Toolbar}
	 */
	addActionMenu : function( dataView, config )
	{		
		Ext.applyIf( config, {
			dataBrowser : this,
			renderTo    : Ext.getBody()
		});
		
		var menu = Ext.create( 'extAdmin.component.dataBrowser.actionDock.Menu', config );
		
		dataView.on( 'itemcontextmenu', function( view, record, node, index, event ) {
			event.stopEvent();
			menu.showAt( event.getXY() );
		} );
	}
});