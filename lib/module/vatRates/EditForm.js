Ext.define( 'extAdmin.module.vatRates.EditForm',
{
	extend : 'extAdmin.component.form.Form',
	
	initComponent : function()
	{
		 this.items = [
            {
                xtype: 'textfield',
                fieldLabel: 'Název',
                anchor: '100%',
                name: 'title'
            },
            {
                xtype: 'hidden',
                fieldLabel: 'Label',
                anchor: '100%',
                name: 'ID'
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Hodnota',
                anchor: '100%',
                decimalSeparator: ',',
                name: 'value'
            },
			{
				xtype	  : 'checkboxfield',
				fieldLabel  : 'Aktivní',
				name      : 'active',
				inputValue: '1'
			}
        ];
		
		Ext.apply( this, {
			title : 'Úprava DPH',
			width : 250,
			bodyPadding: 5
		});
		
		this.callParent();
	}
});