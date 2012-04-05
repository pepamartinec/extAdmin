Ext.define( 'extAdmin.component.editor.DirtyWarning',
{
	extend : 'Ext.window.Window',
	
	editor : null,
	
	continueCb    : null,
	continueScope : null,
	
	/**
	 * Popup initialization
	 * 
	 */
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
			items : [{
				xtype : 'component',
				html  : 'Pozor, mám tu nějaký data na uložení. Určitě chceš pokračovat bez jejich uložení?'
			}],
			
			buttons : [{
				xtype : 'button',
				text  : 'Uložit & pokračovat',
				
				scope   : me,
				handler : me.saveAndContinue
			},{
				xtype : 'button',
				text  : 'Pokračovat bez uložení',
				
				scope   : me,
				handler : me.onlyContinue
			},{
				xtype : 'button',
				text  : 'Zpět',
				
				scope   : me,
				handler : me.cancel
			}]
		});
		
		me.callParent( arguments );
	},
	
	saveAndContinue : function()
	{
		var me = this;
		
		me.close();
		
		me.editor.saveData({
			success : function() {
				Ext.callback( me.continueCb, me.continueScope );
			},
		});
	},
	
	onlyContinue : function()
	{
		var me = this;
		
		me.close();
		
		Ext.callback( me.continueCb, me.continueScope );
	},
	
	cancel : function()
	{
		this.close();
	}
});