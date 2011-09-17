Ext.define( 'extAdmin.widget.form.gridList.actionButton.AddEmpty',
{
	extend : 'extAdmin.widget.form.gridList.AbstractAction',
	alias  : 'glaction.addempty',
	
	texts : {
		title    : 'Přidat',
		tooltip  : 'Přidat novou položku'
	},
	
	constructor : function( config )
	{
		var me = this;
		
		Ext.applyIf( config, {
			iconCls : 'i-add',
			text    : me.texts.title,
			tooltip : me.texts.tooltip,
			handler : function() {
				var list   = me.list,
			        editor = list.editor
				
				// insert empty record
				list.grid.getStore().loadData( [{}], true );
				
				if( editor ) {
					editor.cancelEdit();
					editor.startEdit();
				}
			}		
		});
		
		me.callParent( arguments );
	}
});