Ext.define( 'extAdmin.component.dataView.Grid',
{
	extend : 'Ext.grid.Panel',
	mixins : {
		dataView : 'extAdmin.component.feature.DataView'
	},
	
	uses : [
		'extAdmin.component.dataView.actionDock.Column'
	],
	
	initComponent : function()
	{
		var me = this;
		
		// init actioncolumn
		// TODO find better way to init actions column
		Ext.Array.forEach( me.columns, function( column ) {
			if( column.xtype == 'dynamicactioncolumn' ) {
				column.dataView = me;
			}
		});
		
		me.callParent( arguments );
		
		me.module = me.dataBrowser.module;
		
		// factory actions
		me.factoryActions( me.actions, {
			'module'      : {},
			'record'      : { dataView    : me },
			'dataBrowser' : { dataBrowser : me.dataBrowser }
		});
		
		// create action toolbar
		if( me.enableToolbar !== false && me.barActions ) {
			me.addActionToolbar( me, {
				actions : me.barActions
			});
		}
		
		// create action menu
		if( Ext.isDefined( me.menuActions ) === false ) {
			me.menuActions = me.barActions;
		}
		
		if( me.enableMenu !== false && me.menuActions ) {
			me.addActionMenu( me.getView(), {
				actions : me.menuActions
			});
		}
		
		// update active actions on items selection change
		me.getSelectionModel().on( 'selectionchange', me.updateActionsStates, me );
		me.updateActionsStates();
	},
	
	getActiveRecords : function()
	{
		return this.getSelectionModel().getSelection();
	}
});