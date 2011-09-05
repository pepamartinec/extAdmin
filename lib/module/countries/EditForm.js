Ext.define( 'extAdmin.module.countries.EditForm',
{
	extend : 'extAdmin.component.Form',
	
	requires : ['extAdmin.widget.form.plugin.Localizable'],
	
	plugins : [{
		ptype : 'localizable'
	}],
	
	initComponent : function()
	{
		 this.items = [
            {
                xtype: 'hidden',
                fieldLabel: 'Label',
                anchor: '100%',
                name: 'ID'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Název',
                anchor: '100%',
                name: 'name'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Místní nastavení',
                anchor: '100%',
                name: 'locale'
            },
        ];
		
		Ext.apply( this, {
			title : 'Úprava země',
			width : 250,
			bodyPadding: 5
		});
		
		this.callParent();
	}
});