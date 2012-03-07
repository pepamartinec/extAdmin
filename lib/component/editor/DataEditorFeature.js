Ext.define( 'extAdmin.component.editor.DataEditorFeature',
{
	extend : 'extAdmin.component.ComponentFeature',
	
	uses : [
		'extAdmin.component.editor.action.Load',
		'extAdmin.component.editor.action.Save',
		'extAdmin.component.editor.action.Cancel'
	],
	
	loadAction : null,
	saveAction : null,
	buttons    : null,
	
	/**
	 * @required
	 * @cfg {extAdmin.Environment} env
	 */
	env : null,
	
	/**
	 * Feature constructor
	 */
	constructor : function()
	{
		var me = this;
		
		// factory actions
		this.factoryActions( me.module.getActionNames(), {
			edit : { editor : me }
		});
		
		// setup buttons
		me.addActionButtons( me, me.viewConfig.buttons );
	},
	
	/**
	 * Factories instances of supplied actions
	 * 
	 * @param {String[]} actions
	 * @param {Object/Null} config
	 */
	factoryActions : function( actions, config )
	{
		var me = this;
		
		Ext.applyIf( config || {}, {
			edit : { editor : me }
		});
		
		me.callParent([ actions, config ]);
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
	addActionButtons : function( panel, actions )
	{		
		panel.buttons = this.createItems( actions );
	},
	
	// FIXME move somewhere else
	createItems : function( actions )
	{
		var me = this;
		
		// array of items
		if( Ext.isArray( actions ) ) {
			var instances = [],
			    instance;
			
			for( var i = 0, il = actions.length; i < il; ++i ) {
				instance = me.createItems( actions[i] );
				
				if( instance ) {
					instances.push( instance );
				}
			}
			
			return instances.length > 0 ? instances : null;
		
		// completely defined item
		} else if( Ext.isObject( actions ) ) {
			var item = actions;
			
			switch( item.type ) {
				case 'group':
					return Ext.create( 'Ext.container.ButtonGroup', {
						title   : item.title,
						columns : item.columns || 1,
						items   : me.createItems( item.items )
					});
					
					break;
					
				case 'button':
					var action = me.getAction( item.action );
					
					if( action != null ) {
						return action.createButton({
							text      : item.title,
							rowspan   : item.rowspan || 1,
							scale     : item.size || 'small',
							iconAlign : item.size == 'large' ? 'top' : 'left'
						});
						
					} else {
						return null;
					}
					
					break;
					
				case 'splitButton':
					var btnConfig = {
						xtype     : 'splitbutton',
						text      : item.title,
						rowspan   : item.rowspan || 1,
						scale     : item.size || 'small',
						iconAlign : item.size == 'large' ? 'top' : 'left',
						
						menu : {
							items : me.createItems( item.items )
						}
					};
					
					var action = me.getAction( item.action );
					
					if( action != null ) {						
						return action.createButton( btnConfig );
						
					} else {
						return Ext.widget( btnConfig.xtype, btnConfig );
					}
					break;
			}
			
		// action shortcut
		} else {
			return me.createItems({
				type   : 'button',
				action : actions
			});
		}
	},
	
	getData  : Ext.emptyFn,
	save     : extAdmin.abstractFn,
	
	validate : extAdmin.abstractFn
});