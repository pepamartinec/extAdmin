Ext.define( 'extAdmin.component.editor.DataEditorFeature',
{
	extend : 'extAdmin.component.ComponentFeature',
	
	requires : [
		'extAdmin.component.editor.DirtyWarning'
	],
	
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
		
		me.addEvents(
			/**
			 * Fires before {@link #loadData} action is performed. Return false
			 * from an event handler to stop the action.
			 * 
			 * @event beforeload
			 * @param {extAdmin.component.editor.DataEditorFeature} this
			 */
			'beforeload',
			
			/**
			 * Fires when new data are loaded by {@link #loadData} method.
			 * 
			 * @event load
			 * @param {extAdmin.component.editor.DataEditorFeature} this
			 * @param {Object} data
			 */
			'load',
			
			/**
			 * Fires before {@link #saveData} action is performed. Return false
			 * from an event handler to stop the action.
			 * 
			 * @event beforesave
			 * @param {extAdmin.component.editor.DataEditorFeature} this
			 * @param {Object} data
			 */
			'beforesave',
			
			/**
			 * Fires when data are saved by {@link #saveData} method.
			 * 
			 * @event save
			 * @param {extAdmin.component.editor.DataEditorFeature} this
			 * @param {Object} data
			 */
			'save',
			
			/**
			 * Fires when record is updated by {@link #saveData} method
			 * (data saved & record existed previously).
			 * 
			 * @event update
			 * @param {extAdmin.component.editor.DataEditorFeature} this
			 * @param {Object} data
			 */
			'update',
			
			/**
			 * Fires when record is updated by {@link #saveData} method
			 * (data saved & record has not existed previously).
			 * 
			 * @event create
			 * @param {extAdmin.component.editor.DataEditorFeature} this
			 * @param {Object} data
			 */
			'create'
		);
		
		me.loadAction = me.module.normalizeActionPtr( me.viewConfig.loadAction );
		me.saveAction = me.module.normalizeActionPtr( me.viewConfig.saveAction );
		
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
		
		me.addActionInterceptor( config, {
			before : me.beforeActionRun,
			scope  : me
		});
		
		me.callParent([ actions, config ]);
	},
	
	beforeActionRun : function( action, cb, cbScope )
	{
		var me = this;
		
		// save action do not pre-check for dirty data
		// TODO find better place for this exception
		if( action instanceof extAdmin.component.editor.action.Save ) {
			Ext.callback( cb, cbScope );
			return;
		}
		
		if( me.isDirty() ) {
			Ext.create( 'extAdmin.component.editor.DirtyWarning', {
				editor   : me,
				autoShow : true,
				
				continueCb    : cb,
				continueScope : cbScope
			});
			
		} else {
			Ext.callback( cb, cbScope );
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
	
	loadData : function( config )
	{
		var me     = this,
		    action = me.loadAction;
		
		// fire beforeload
		if( me.fireEvent( 'beforeload', me ) === false ) {
			return;
		}
		
		// normalize action
		if( config.action ) {
			action = me.module.normalizeActionPtr( config.action );
		}
		
		// run action
		me.runAction( action, {
			data       : config.data,
			maskTarget : me.viewRegion,
			message    : 'Načítám data...',
			
			success : function( response ) {
				// update data
				me.setData( response.data );
				
				// perform any callback
				Ext.callback( config.success, config.scope );
				
				// fire load event
				me.fireEvent( 'load', me, response.data );
			},
			
			failure : function( response ) {				
				Ext.Msg.show({
					closable : false,
					modal    : true,
					
					title   : 'Chyba při načítání dat',
					icon    : Ext.window.MessageBox.ERROR,
					msg     : response.message,
					buttons : Ext.Msg.OK,
					
					fn : function() {
				    	Ext.callback( config.failure, config.scope );
				    }
				});
			},
			
			exception : config.exception
		});
	},
	
	saveData : function( config )
	{
		var me   = this,
		    data = me.getData();
		
		// fire beforesave event
		if( me.fireEvent( 'beforesave', me, data ) === false ) {
			return;
		}
		
		// FIXME find better way to check this
		var isPersisted = ( data['ID'] != null );
		
		// run action
		me.runAction( me.saveAction, {
			data       : data,
			maskTarget : me.viewRegion,
			message    : 'Ukládám data...',
			
			success : function( response ) {
				// check for updated data in response
				if( response.data ) {
					me.setData( response.data );
					
				} else {
					Ext.Error.raise({
						msg : 'Data saved successfuly but server did not send updated values',
						response : response
					});
				}
				
				// perform any callback
				Ext.callback( config.success, config.scope );
				
				// fire events
				me.fireEvent( 'save', me, response.data );
				
				if( isPersisted ) {
					me.fireEvent( 'update', me, response.data );
					
				} else {
					me.fireEvent( 'create', me, response.data );
				}
			},
			
			failure : function( response ) {
				Ext.Msg.show({
					closable : false,
					modal    : true,
					
					title   : 'Chyba při ukládání dat',
					icon    : Ext.window.MessageBox.ERROR,
					msg     : response.message,
					buttons : Ext.Msg.OK,
					
					fn : function() {
				    	Ext.callback( config.failure, config.scope );
				    }
				});
			},
			
			exception : config.exception
		});
	},
	
	getData     : extAdmin.abstractFn,
	setData     : extAdmin.abstractFn,
	getRecordId : extAdmin.abstractFn,
	
	isValid : extAdmin.abstractFn,
	isDirty : extAdmin.abstractFn
});