Ext.define( 'extAdmin.widget.form.gridList.actionButton.Remove',
{
	icon    : 'images/administration/icons/delete.png',
	
	texts : {
		tooltip  : 'Smazat položku',
		popTitle : 'Potvrzení smazání',
		popText  : 'Opravdu chcete odstranit tuto položku?'
	},
	
	constructor : function( handler, scope )
	{
		var me = this;
		
		me.tooltip = me.texts.tooltip;
		me.handler = function( grid, rowIdx ) {
			Ext.MessageBox.confirm( me.texts.popTitle, me.texts.popText, function( btn ) {
				if( btn == 'ok' || btn == 'yes' )
					handler.call( scope, [ rowIdx ] );
			}, this );
		};
	}
});