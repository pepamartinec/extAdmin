Ext.define( 'extAdmin.module.countries.InfoEditForm',
		{
	extend : 'extAdmin.component.Form',

	requires : ['extAdmin.widget.form.plugin.Localizable'],

	plugins : [{
		ptype : 'localizable'
	}],

	initComponent : function()
	{
		this.items = [{
			xtype : 'hidden',
			name  : 'ID'
		},{
			xtype  : 'container',
			layout : 'hbox',
			items  : [{
				xtype      : 'numberfield',
				fieldLabel : 'Výše DPH',
				name       : 'vat',
				step       : 0.1,
				decimalPrecision : 1,
				flex       : 1
			},{
				xtype      : 'numberfield',
				fieldLabel : 'Výše cla',
				name       : 'duty',
				step       : 0.1,
				decimalPrecision : 1,
				flex       : 1,
				labelAlign : 'right',
			}]
		},{
			xtype      : 'tinymcefield',
			fieldLabel : 'Informace ke clu',
			name       : 'dutyInfo'
		}];

		Ext.apply( this, {
			title : 'Úprava informací o státu',
			width : 600,
			bodyPadding: 5
		});

		this.callParent();
	}
});