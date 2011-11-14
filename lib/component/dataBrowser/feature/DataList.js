Ext.define( 'extAdmin.component.dataBrowser.feature.DataList',
{
	requires : [
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsBar',
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsMenu',
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsColumn'
	],
	
	/**
	 * Returns module default config
	 * 
	 * @return {Object}
	 */
	getDefaultConfig : inspirio.abstractFn,
	
	/**
	 * Builds dataList configuration
	 * 
	 * @param  {Object|Null} userConfig
	 * @return {Object|Null}
	 */
	secureConfig : function( userConfig )
	{
		return this.mergeConfig( this.getDefaultConfig(), userConfig );
	},
	
	/**
	 * Merges default and user config
	 * 
	 * @private
	 * @param  {Object|Null} defaultConfig
	 * @param  {Object|Null} userConfig
	 * @return {Object|Null}
	 */
	mergeConfig : function( defaultConfig, userConfig )
	{
		var me = this,
		    localItem, newItem;
		
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
				defaultConfig[ name ] = me.mergeConfig( defaultItem, userItem );
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
	}
});
