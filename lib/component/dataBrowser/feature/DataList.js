Ext.define( 'extAdmin.component.dataBrowser.feature.DataList',
{
	uses : [
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsBar',
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsMenu',
		'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsColumn'
	],
	
	constructor : function( config )
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

		}
		
		// create actionsMenu
		if( config.enableMenu !== false && config.menuActions ) {

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

			}
			
			// row key press
			if( rowActions['enter'] || rowActions['delete'] ) {

			}
		}
		
		// update active actions on items selection change
		me.getSelectionModel().on( 'selectionchange', me.module.updateActionsStates, me.module );
		me.module.updateActionsStates();
	},
	
	activateToolbar : function( barActions )
	{			
		var actionsBar = Ext.create( 'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsBar', {
			dock : 'top',
			
			module         : me.module,
	    	selectionModel : me.getSelectionModel(),
	    	
			actions : barActions
		});
		
		me.addDocked( actionsBar );
	},
	
	activateContextMenu : function( menuActions )
	{
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
	},
	
	activateRowActions : function()
	{
		
	},
	
	activateMouseEvents : function()
	{
		var clickAction = me.module.getAction( rowActions.click );
		
		if( clickAction ) {
			me.on( 'itemdblclick', function( view, record ) {
				if( clickAction.isDisabled() == false ) {
					clickAction.execute([ record ]);
				}
			} );
		}
	},
	
	activateKeyboardEvents : function()
	{
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
});
