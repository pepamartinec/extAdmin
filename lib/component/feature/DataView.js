Ext.define( 'extAdmin.component.feature.DataView',
{
	uses : [
		'extAdmin.component.dataView.actionDock.Toolbar',
		'extAdmin.component.dataView.actionDock.Menu'
	],
	
	/**
	 * @cfg {Array}
	 * @property {Object}
	 */
	actions : null,
	
	/**
	 * Factories instances of supplied actions
	 * 
	 * @param {String[]} actions
	 * @param {Object} config
	 */
	factoryActions : function( actions, config )
	{
		this.actions = this.module.factoryActions( actions, config );
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
			dock        : 'top',
			dataBrowser : this
		});
		
		if( panel.dockedItems == null ) {
			// TODO better solution??
			panel.initDockingItems();
		}
		
		panel.addDocked( Ext.create( 'extAdmin.component.dataView.actionDock.Toolbar', config ) );
	},
	
	/**
	 * Creates action menu
	 * 
	 * @protected
	 * 
	 * @param {Ext.view.AbstractView} dataView DataView to which menu should be bound
	 * @param {Object} config Menu config object
	 * @param {String[]} [config.actions] List of module action names to display in toolbar
	 * @param {String}   [config.dataBrowser=this] Optional dataBrowser instance
	 * @param {String}   [config.renderTo=Ext.getBody()] Optional render container
	 */
	addActionMenu : function( dataView, config )
	{		
		Ext.applyIf( config, {
			dataBrowser : this,
			renderTo    : Ext.getBody()
		});
		
		var menu = Ext.create( 'extAdmin.component.dataView.actionDock.Menu', config );
		
		dataView.mon( dataView, 'itemcontextmenu', function( view, record, node, index, event ) {
			event.stopEvent();
			menu.showAt( event.getXY() );
		} );
		
		dataView.mon( dataView, 'destroy', function() {
			menu.destroy();
		});
	},
	

	
	/**
	 * Creates action buttons
	 * 
	 * @protected
	 */
	addActionButtons : function( panel, config )
	{		
		// TODO
	},

	xxxxxx : function( config )
	{		
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
	 * Returns list of currently active records
	 * 
	 * @return {extAdmin.Model[]}
	 */
	getActiveRecords : extAdmin.abstractFn,
	
	/**
	 * Records change notification callback
	 * 
	 * Should be called by actions when some records were changed
	 * 
	 * @param {Object} changes Changes list
	 * @param {extAdmin.Model[]} [changes.created] List of newly created records
	 * @param {extAdmin.Model[]} [changes.updated] List of updated records
	 * @param {extAdmin.Model[]} [changes.deleted] List of deleted records
	 */
	notifyRecordsChange : extAdmin.abstractFn
});