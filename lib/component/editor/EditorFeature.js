Ext.define( 'extAdmin.component.editor.EditorFeature',
{
	requires : [
		'Ext.toolbar.Toolbar',
		'extAdmin.component.editor.action.Load',
		'extAdmin.component.editor.action.Save',
		'extAdmin.component.editor.action.Cancel'
	],
	
	/**
	 * @cfg {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * @cfg {extAdmin.component.editor.container.ContainerFeature} viewRegion
	 */
	viewRegion : null,
	
	/**
	 * @cfg {Array} actions
	 * @property {Object} actions
	 */
	actions : null,
	
	loadAction : null,
	saveAction : null,
	buttons    : null,
	
	/**
	 * Feature constructor
	 */
	constructor : function()
	{
		var me = this;
		
		// factory (all) actions
		me.actions = me.module.factoryActions( me.module.getActionNames(), {
			'module' : {},
			'record' : { dataView : me }, // FIXME ?? dataView ??
			'edit'   : { editor   : me }
		});
		
		// setup buttons
		me.addActionToolbar( me, {
			dock    : 'bottom',
			ui      : 'footer',
			defaults: { minWidth : Ext.panel.Panel.prototype.minButtonWidth },
			actions : me.buttons
		});
		
		delete me.buttons;
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
	 * Creates action toolbar
	 * 
	 * @protected
	 * 
	 * @param {Ext.panel.AbstractPanel} panel Panel into which dock the toolbar
	 * @param {Object} config Toolbar config object
	 * @param {String[]} [config.actions] List of module action names to display in toolbar
	 * @param {String}   [config.dataBrowser=this] Optional dataBrowser instance
	 * @param {String}   [config.dock=top] Optional toolbar position
	 * @returns {extAdmin.component.dataView.actionDock.Toolbar}
	 */
	addActionToolbar : function( panel, config )
	{
		Ext.applyIf( config, {
			dock : 'top',
			dataBrowser : this // FIXME !!! rename this to something more abstract !!! 
		});
		
		var toolbar = Ext.create( 'extAdmin.component.dataView.actionDock.Toolbar', config );
		
		if( panel.dockedItems == null ) {
			panel.dockedItems = [ toolbar ];
			
		} else if( Ext.isArray( panel.dockedItems ) ) {
			panel.dockedItems.push( toolbar );
			
		} else {		
			panel.addDocked( toolbar );
		}
	},
	
	getData  : Ext.emptyFn,
	save     : extAdmin.abstractFn,
	
	validate : extAdmin.abstractFn
});