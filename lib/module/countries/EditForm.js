Ext.define( 'extAdmin.module.countries.EditForm',
		{
	extend : 'extAdmin.component.form.Form',

	isLocalizable : true,

	initComponent : function()
	{
		this.items = [{
			xtype : 'hidden',
			name  : 'ID'
		},{
			xtype      : 'textfield',
			fieldLabel : 'Název státu',
			name       : 'name',
			allowBlank : false
		},{
			xtype  : 'container',
			layout : 'hbox',
			items  : [{
				xtype      : 'textfield',
				fieldLabel : 'Jazyk',
				name       : 'languageName',
				allowBlank : false,
				flex       : 1
			},{
				xtype      : 'textfield',
				fieldLabel : 'Místní nastavení',
				name       : 'locale',
				allowBlank : false,
				flex       : 1,
				labelAlign : 'right',
			}]
		},{
			xtype       : 'foreingrecordfield',
			fieldLabel  : 'Měna',
			name        : 'currencyID',
			allowBlank  : false,
			module      : this.module,
			fetchAction : 'getCurrencies'
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
				xtype : 'component',
				html  : '%'
			},{
				xtype      : 'numberfield',
				fieldLabel : 'Výše cla',
				name       : 'duty',
				step       : 0.1,
				decimalPrecision : 1,
				flex       : 1,
				labelAlign : 'right',
			},{
				xtype : 'component',
				html  : '%'
			}]
		},{
			xtype      : 'tinymcefield',
			fieldLabel : 'Informace ke clu',
			name       : 'dutyInfo'
		}];

		Ext.apply( this, {
			title : 'Úprava státu',
			width : 600,
			bodyPadding: 5
		});

		this.callParent();
	}
});