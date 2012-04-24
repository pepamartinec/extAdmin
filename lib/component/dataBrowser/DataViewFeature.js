Ext.define( 'extAdmin.component.dataBrowser.DataViewFeature',
{
	extend : 'extAdmin.component.ComponentFeature',

	requires : [
		'extAdmin.component.Model',
		'extAdmin.Store'
	],

	uses : [
		'extAdmin.component.dataBrowser.actionDock.Column',
		'extAdmin.component.dataBrowser.actionDock.Menu',
		'extAdmin.component.dataBrowser.actionDock.Toolbar'
	],

	fields        : null,
	enableToolbar : true,
	barActions    : null,
	enableMenu    : true,
	menuActions   : null,
	sort          : null,

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
			dataBrowser : { dataBrowser : me }
		});

		me.callParent([ actions, config ]);
	},

	/**
	 * Configured component data store
	 *
	 * @param {Object/Null} config
	 * @returns {Ext.data.AbstractStore}
	 */
	configDataStore : function( config )
	{
		var me = this;

		config = config || {};

		// model defined
		if( me.model || config.model ) {
			Ext.apply( config, {
				model : me.model || config.model
			});

		// fields defined
		} else if( me.fields ) {
			Ext.apply( config, {
				model         : extAdmin.component.Model.create( me.fields ),
				implicitModel : true
			});

		// neither model nor fields defined
		} else {
			Ext.Error.raise({
				msg      : 'Model or fields configuration is missing',
				dataView : me
			});
		}


		Ext.apply( config, {
			env        : me.module.env,
			loadAction : me.module.normalizeActionPtr( me.loadAction )
		});

		if( me.sort ) {
			config.sorters = {
				property  : me.sort.column,
				direction : me.sort.dir || 'asc'
			};
		}

		me.store = extAdmin.Store.create( config );
	},

	/**
	 * Configures component columns
	 *
	 * Requires previously configured data store!
	 *
	 * @returns {Ext.data.AbstractStore}
	 */
	configColumns : function( gridConfig )
	{
		var me      = this,
		    columns = [],
		    fields  = me.fields,
		    field, column;

		for( var dataIdx in fields ) {
			field  = fields[ dataIdx ];
			column = {
				dataIndex : dataIdx
			};

			// FIXME get rid of extAdmin.applyConfig(If)
			extAdmin.applyConfigIf( column, {
				header       : field.title,
				align        : field.align,
				width        : field.width,
				flex         : field.width ? false : true,
				sortable     : field.sortable,
				groupable    : field.groupable,
				hideable     : field.hideable || field.hidden,
				hidden       : field.hidden,
				menuDisabled : field.disableMenu
	//			editor    : field.editor,
	//			tpl       : field.tpl,
	//			tdCls     : field.tdCls,
	//			renderer  : field.renderer
			});

			switch( field.type ) {
//				case 'date':
//				case 'datecolumn':
//
//				case 'datetime':
//				case 'datetimecolumn':
//					column.xtype = 'datecolumn';
//					break;
//
//				case 'currency':
//				case 'currencycolumn':
//					column.xtype = 'currencycolumn';
//
//					if( field.currencyField ) {
//						column.currencyField = field.currencyField;
//					}
//					break;

				case 'action':
				case 'actioncolumn':
					column.xtype          = 'dynamicactioncolumn';
					column.dataStore      = me.store;
					column.allowedActions = field.items;
					column.dataView       = me;
					break;

				default:
					if( field.type ) {
						column.xtype = field.type;
					}
					break;
			}

			columns.push( column );
		}

		me.columns = columns;
	},

	/**
	 * Configures component actions and add enabled action docks
	 *
	 * @param {Array/Null}  actions
	 * @param {Object/Null} config
	 */
	configActions : function( actions, config )
	{
		var me = this;

		// factory actions
		actions = actions || [];
		config  = config  || {};

		actions = actions.concat( me.barAction || [], me.menuActions || [] );

		me.factoryActions( actions, config );

		// create action toolbar
		if( me.enableToolbar && me.barActions ) {
			me.addActionToolbar( me, {
				actions : me.barActions
			});
		}

		// create action menu
		if( Ext.isDefined( me.menuActions ) === false ) {
			me.menuActions = me.barActions;
		}

		if( me.enableMenu && me.menuActions ) {
			me.addActionMenu( me.getView(), {
				actions : me.menuActions
			});
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
	 * @returns {extAdmin.component.dataBrowser.actionDock.Toolbar}
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

		panel.addDocked( Ext.create( 'extAdmin.component.dataBrowser.actionDock.Toolbar', config ) );
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

		var menu = Ext.create( 'extAdmin.component.dataBrowser.actionDock.Menu', config );

		this.mon( dataView, 'itemcontextmenu', function( view, record, node, index, event ) {
			event.stopEvent();
			menu.showAt( event.getXY() );
		} );

		this.mon( dataView, 'destroy', function() {
			menu.destroy();
		});
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
	 * Returns an array of the currently selected records.
	 *
	 * @return {extAdmin.Model[]}
	 */
	getSelection : extAdmin.abstractFn,

	/**
	 * Records change notification callback
	 *
	 * Should be called by actions when some records were changed
	 *
	 * @param {Object} changes Changes list
	 * @param {Number[]} [changes.created] List of newly created record IDs
	 * @param {Number[]} [changes.updated] List of updated record IDs
	 * @param {Number[]} [changes.deleted] List of deleted record IDs
	 */
	notifyRecordsChange : extAdmin.abstractFn
});