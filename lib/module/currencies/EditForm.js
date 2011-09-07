Ext.define( 'extAdmin.module.currencies.EditForm',
		{
	extend : 'extAdmin.component.Form',

	initComponent : function()
	{
		this.items = [{
			xtype      : 'hidden',
			name       : 'ID'
		},{
			xtype      : 'textfield',
			fieldLabel : 'Kód',
			name       : 'code'
		},{
			xtype      : 'numberfield',
			fieldLabel : 'Kurz (vůči CZK)',
			name       : 'exchangeRate',
			step       : 0.1,
			decimalPrecision : 3
		},{
			xtype      : 'checkbox',
			fieldLabel : 'Aktualizovat automaticky',
			name       : 'automaticUpdate'
		}];
		
		Ext.apply( this, {
			title : 'Úprava měny',
			bodyPadding: 5
		});

		this.callParent();
	}
});