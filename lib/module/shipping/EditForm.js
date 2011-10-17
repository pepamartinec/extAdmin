Ext.define( 'extAdmin.module.shipping.EditForm',
{
	extend : 'extAdmin.component.form.Form',
	
	isLocalizable : true,
	
	initComponent : function()
	{
		var me = this;

		me.vatField = Ext.create('extAdmin.widget.form.ForeingRecord', {
			name        : 'vatRateID',
			fieldLabel  : 'DPH',
			fetchAction : 'loadVatRates',
			allowBlank  : false,
			module      : me.module,
			fields      : [
				{ name: 'ID' },
				{ name: 'title', type: 'string' },
				{ name: 'value', type: 'float' }
			],
			listeners    : {
				change : me.recalculateAllItemsPrices,
				scope  : me
			}
		});

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
			},{
				xtype      : 'checkbox',
				fieldLabel : 'Vyžaduje doručovací adresu',
				boxLabel   : '',
				name       : 'isDeliveryAddressRequired',
				inputValue : 1,
				checked    : false
			},
			me.vatField
		]};
		
		me.pricesList = Ext.create('extAdmin.widget.form.gridList.GridList', {
			name       : 'prices',

			plugins: [{
				ptype : 'gl_inlineeditor',
				editors : {
					from     : 'numberfield',
					to       : 'numberfield',
					price    : 'numberfield',
					priceVat : 'numberfield'
				},
				listeners : {
					edit : function( editor, e ) {
						me.recalculateItemPrices( e.field, e.record );
					}
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
				ID       : { header : '#', width : 25, hidden : true },
				from     : { header : 'od',   type: 'numbercolumn', format : '0.00' },
				to       : { header : 'do',   type: 'numbercolumn', format : '0.00' },
				price    : { header : 'Cena', type: 'numbercolumn', format : '0.00' },
				priceVat : { header : 'Cena s DPH', type: 'numbercolumn', format : '0.00' }
			}
		});
		
		var pricesInfo = {
			xtype 	: "fieldset",
			title	: "Ceny",
			items	: [me.pricesList]
		};
		
		this.addTab({
			title : 'Základní',
			items : [ baseInfo, pricesInfo ]
		});
		
		Ext.apply( this, {
			title : 'Úprava dopravy'
		});
		
		this.callParent();
	}, 
	
	recalculateItemPrices : function( field, record )
	{
		var me = this;
		var activeVatRateID = me.vatField.getValue();
		if(activeVatRateID == null) {
			if(field == 'price') {
				record.set('priceVat', record.get('price'));
			} else if(field == 'priceVat') {
				record.set('price', record.get('priceVat'));
			}
			return;
		}
		var activeVatRate   = me.vatField.getStore().getById(activeVatRateID);
		
		if(activeVatRate == null) return;
		
		if(field == 'price') {
			record.set('priceVat', record.get('price')*( 1 + (activeVatRate.get('value')/100) ));
		} else if(field == 'priceVat') {
			record.set('price', record.get('priceVat')  / (1 + (activeVatRate.get('value')/100)));
		}
	},
	recalculateAllItemsPrices : function( field ) 
	{
		var me = this;
		var prices = me.pricesList.getStore().getRange();
		var activeVatRateID = field.getValue();
		var activeVatRate   = me.vatField.getStore().getById(activeVatRateID);
		
		if(activeVatRate == null) return;
		
		for( var i = 0; i < prices.length; i++ ) {
			prices[i].set('priceVat', prices[i].get('price') * ( 1 + (activeVatRate.get('value')/100) ) )
		}
	}
});