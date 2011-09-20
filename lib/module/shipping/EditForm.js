Ext.define( 'extAdmin.module.shipping.EditForm',
{
	extend : 'extAdmin.component.form.Form',
	
	isLocalizable : true,
	
	initComponent : function()
	{

		var baseInfo = {
			xtype	: 'fieldset',
			title	: 'základní informace',
			items	: [{
				xtype: 'hidden',
				name: 'ID'
			},{
				xtype      : 'textfield',
				fieldLabel : 'Název',
				name       : 'title'
			},{
				fieldLabel : 'Pozice',
				xtype      : 'positionfield',
				module     : this.module
			},{
				fieldLabel	: 'Adresa zásilky',
				xtype		: 'textfield',
				name		: 'trackingUrl'
			},{
				xtype      : 'checkbox',
				fieldLabel : 'Publikovat',
				boxLabel   : '',
				name       : 'publish',
				inputValue : 1,
				checked    : false
			}]
		};
		
		var pricesInfo = {
			xtype 	: "fieldset",
			title	: "Ceny",
			items	: [{
				xtype      : 'listfield',
				name       : 'prices',
				
				plugins: [{
					ptype : 'gl_inlineeditor',
					editors : {
						from  : 'numberfield',
						to    : 'numberfield',
						price : 'numberfield'
					}
				}],
				
				barActions : [{
					atype : 'addempty',
					text  : 'Přidat novou'
				}],
				
				rowActions : [{
					atype : 'remove'
				}],
				
				columns : {
					ID    : { header : '#', width : 25, hidden : true },
					from  : { header : 'od',   type: 'numbercolumn', format : '0.00' },
					to    : { header : 'do',   type: 'numbercolumn', format : '0.00' },
					price : { header : 'Cena', type: 'numbercolumn', format : '0.00' }
				}
			}]
		};
		
		this.addTab({
			title : 'Základní',
			items : [ baseInfo, pricesInfo ]
		});
		
		Ext.apply( this, {
			title : 'Úprava dopravy'
		});
		
		this.callParent();
	}
});