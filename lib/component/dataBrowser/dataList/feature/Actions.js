Ext.define( 'extAdmin.component.dataBrowser.dataList.feature.Actions',
{	
	requires : [
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsBar',
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsMenu',
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsColumn',
	],
	
	initActions : function( config )
	{
		var me = this;
		
		Ext.applyIf( config, {
			enableToolbar : true,
			enableMenu    : true
		});
		
		// init actions
		me.module.initActions( 'dataList', { dataList : me });
		
		var featureConfig = {
			module         : config.module,
	    	selectionModel : config.selectionModel,
	    	
			beforeExecute      : config.beforeExecute || Ext.emptyFn,
			beforeExecuteScope : config.beforeExecuteScope || window,
			
			afterExecute      : config.afterExecute || Ext.emptyFn,
			afterExecuteScope : config.afterExecuteScope || window
	    };
		
		// create actionsBar
		if( config.enableToolbar ) {
			var barActions = config.barActions;
			
			if( barActions == null ) {
				barActions = [];
				
				for( var aName in config.module.actions ) {
					var action = config.module.actions[ aName ];
					
//					if( action instanceof extAdmin.action.DataList ) {
						barActions.push( aName );
//					}
				}
			}
			
			var actionsBar = Ext.create( 'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsBar', Ext.apply( {
				actions : barActions
			}, featureConfig ) );
			
			me.addDocked( actionsBar );
		}
		
		// create actionsMenu
		if( config.enableMenu ) {
			var actionsMenu = Ext.create( 'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsMenu', Ext.apply( {
				actions  : config.rowActions,
				renderTo : Ext.getBody()
			}, featureConfig ) );
			
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
				Ext.apply( column, featureConfig );
			}
		}
		
		// enable direct interaction with row
		if( config.rowActions ) {
			var rowActions = config.rowActions;
			
			// row dblClick
			if( rowActions.click ) {
				var clickAction = config.module.getAction( rowActions.click );
				
				if( clickAction ) {
					me.on( 'itemdblclick', function( view, record ) {
						if( clickAction.isDisabled() == false ) {
							clickAction.execute([ record ], featureConfig.afterExecute, featureConfig.afterExecuteScope );
						}
					} );
				}
			}
			
			// row key press
			if( rowActions.enter || rowActions['delete'] ) {
				var enterAction  = rowActions.enter     ? config.module.getAction( rowActions.enter )     : null,
				    deleteAction = rowActions['delete'] ? config.module.getAction( rowActions['delete'] ) : null;
								
				me.getView().on( 'itemkeydown', function( view, record, row, index, event ) {
					var action = null;
					
					switch( event.getKey() ) {
						case Ext.EventObject.ENTER     : action = enterAction; break;
						case Ext.EventObject.DELETE    : action = deleteAction; break;
						case Ext.EventObject.BACKSPACE : action = deleteAction; break;
						default : return;
					}
					
					if( action.isDisabled() == false ) {
						var records = config.selectionModel.getSelection();
						
						action.execute( records, featureConfig.afterExecute, featureConfig.afterExecuteScope);
					}
				});
			}
		}
		
		// update active actions on items selection change
		config.selectionModel.on( 'selectionchange', config.module.updateActionsStates, config.module );
		config.module.updateActionsStates();
	}
});