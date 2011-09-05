Ext.define( 'extAdmin.component.dataList.feature.Actions',
{	
	requires : [
		'extAdmin.component.dataList.feature.actions.ActionsBar',
		'extAdmin.component.dataList.feature.actions.ActionsMenu',
		'extAdmin.component.dataList.feature.actions.ActionsColumn',
	],
	
	initActions : function( config )
	{
		var me = this;
		
		Ext.applyIf( config, {
			enableToolbar : true,
			enableMenu    : true
		});
		
		// pick available actions
		var availableActions = Ext.Object.getKeys( me.module.actions );
		me.actions = {};
		for( var i = 0, al = availableActions.length; i < al; ++i ) {
			var actionName = availableActions[ i ],
			    action = config.module.getAction( actionName );
			
			me.actions[ actionName ] = action;
		}
		
		var featureConfig = {
			module         : config.module,
	    	actions        : availableActions,
	    	selectionModel : config.selectionModel,
	    	
			beforeExecute      : config.beforeExecute || Ext.emptyFn,
			beforeExecuteScope : config.beforeExecuteScope || window,
			
			afterExecute      : config.afterExecute || Ext.emptyFn,
			afterExecuteScope : config.afterExecuteScope || window
	    };
		
		// create actionsBar
		if( config.enableToolbar ) {
			var actionsBar = Ext.create( 'extAdmin.component.dataList.feature.actions.ActionsBar', featureConfig );
			
			me.addDocked( actionsBar );
		}
		
		// create actionsMenu
		if( config.enableMenu ) {
			var actionsMenu = Ext.create( 'extAdmin.component.dataList.feature.actions.ActionsMenu', featureConfig );
			
			me.on( 'itemcontextmenu', function( view, record, node, index, event ) {
				event.stopEvent();
				actionsMenu.showAt( event.getXY() );
				return false;
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
		config.selectionModel.on( 'selectionchange', me.updateActionsStates, me );
		me.updateActionsStates( config.selectionModel, [] );
	},
	
	
	/**
	 * Updates actions state
	 * 
	 * @public
	 */
	updateActionsStates : function( selModel, records )
	{
		var me = this,
		    counter = {};

		// init counter
		for( var aName in me.actions ) {
			counter[ aName ] = 0;
		}
		
		// count actions
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			var rActions = records[i].data['actions'];
			
			// some row has no actions at all
			// we don't need to continue
			if( typeof rActions == 'undefined' ) {
				break;
			}
			
			for( var j = 0, ral = rActions.length; j < ral; ++j ) {
				++counter[ rActions[ j ] ];
			}
		}
		
		// toggle actions
		for( var aName in me.actions ) {
			var action = me.actions[ aName ];
			
			action.setDisabled( action.dataDep == true && (
					( action.multiRow == false && records.length > 1 ) || records.length == 0 || counter[ aName ] < records.length
			) );
		}
	}
});