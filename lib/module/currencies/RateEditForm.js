Ext.define( 'extAdmin.module.currencies.RateEditForm',
		{
	extend : 'extAdmin.component.Form',

	initComponent : function()
	{
		this.items = [{
			xtype      : 'hidden',
			name       : 'ID'
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
			title : 'Úprava kurzu',
			width : 250,
			bodyPadding: 5
		});

		this.callParent();
	}
});