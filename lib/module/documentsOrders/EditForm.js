Ext.define( 'extAdmin.module.documentsOrders.EditForm',
{
	extend : 'extAdmin.component.form.Form',
	
	uses : [
		'extAdmin.module.products.Lookup'
	],
	
	initComponent : function()
	{
		var me = this;
		
		var spacer = {
			xtype  : 'container',
			height : 20
		};
		
		me.initDataStores();
		
		// ================== ITEMS LIST =================
		me.itemsPriceFld = Ext.create( 'Ext.form.field.Text', {
			readOnly : true
		});
		
		me.itemsVatPriceFld = Ext.create( 'Ext.form.field.Text', {
			readOnly : true
		});
		
		me.shippingPriceFld = Ext.create( 'Ext.form.field.Text', {
			fieldLabel : 'Poštovné',
			labelAlign : 'right',
			readOnly   : true
		});
		
		me.paymentPriceFld = Ext.create( 'Ext.form.field.Text', {
			fieldLabel : 'Platební příplatek',
			labelAlign : 'right',
			readOnly   : true
		});
		
		me.totalVatPriceFld = Ext.create( 'Ext.form.field.Text', {
			fieldLabel : '<b>Celkem</b>',
			labelAlign : 'right',
			readOnly   : true
		});
		
		me.addTab({
			title : 'Seznam zboží',
			items : [{
				xtype  : 'listfield',
				name   : 'items',
				height : 500,
				
				plugins: [{
					ptype : 'gl_inlineeditor',
					editors : {
						amount : {
							xtype      : 'numberfield',
							allowblank : false
						}
					},
					listeners : {
						edit : function( editor, e ) {
							me.recalculatePrice( e.record );
						}
					}
				}],
				
				barActions : [{
					atype   : 'addlookup',
					lookup  : 'products',
					mapping : {
						productIdentificatorID : 'ID',
						productTitle           : 'title',
						itemPrice              : { data : function( product ) { return product.getFinalPrice( false ); } },
						amount                 : { data : 1 },
						price                  : { data : function( product ) { return product.getFinalPrice( false ); } },
						vatPrice               : { data : function( product ) { return product.getFinalPrice( true ); } }
					}
				},{
					atype : 'addempty'
				}],
				
				rowActions : [{
					atype : 'remove'
				}],
				
				columns : {
					productIdentificatorID : { header : '#', width : 25 },
					productTitle           : { header : 'Název' },
					itemPrice              : { header : 'Cena / kus (bez DPH)' },
					amount                 : { header : 'Počet kusů' },
					price                  : { header : 'Cena (bez DPH)' },
					vatPrice               : { header : 'Cena (s DPH)' },
				},
					
				dockedItems : [{
					xtype : 'toolbar',
					dock  : 'bottom',
					items : [{
						xtype : 'tbfill'
					},{
						xtype : 'container',
						items : [{
							xtype      : 'fieldcontainer',
							fieldLabel : 'Cena položek',
							items      : [ me.itemsPriceFld, me.itemsVatPriceFld ]
						}, me.shippingPriceFld, me.paymentPriceFld, me.totalVatPriceFld ]
					}]
				}],
				
				listeners : {
					scope : me,
					datachanged : me.updateSummary
				}
			}]
		});
		
		// ================== PAYMENT =================
		me.addTab({
			title : 'Platební údaje',
			items : [{
				xtype : 'hfbox',
				items : [{
					xtype      : 'textfield',
					name       : 'customerFirstName',
					fieldLabel : 'Jméno'	
				},{
					xtype      : 'textfield',
					name       : 'customerLastName',
					fieldLabel : 'Příjmení'	
				}]	
			},{
				xtype      : 'textfield',
				name       : 'customerCompanyName',
				fieldLabel : 'Název firmy'	
			},{
				xtype : 'hfbox',
				items : [{
					xtype      : 'textfield',
					name       : 'customerCompanyIdentificator',
					fieldLabel : 'IČO'	
				},{
					xtype      : 'textfield',
					name       : 'customerVatIdentificator',
					fieldLabel : 'DIČ'	
				}]	
			},
			
			spacer,
			
			{
				xtype : 'hfbox',
				items : [{
					xtype      : 'textfield',
					name       : 'customerAddress',
					fieldLabel : 'Adresa, čp.',
					flex       : .7
				},{
					xtype      : 'textfield',
					name       : 'customerZipCode',
					fieldLabel : 'PSČ',
					labelWidth : 50,
					flex       : .3
				}]	
			},{
				xtype : 'hfbox',
				items : [{
					xtype      : 'textfield',
					name       : 'customerTown',
					fieldLabel : 'Město'	
				},{
					xtype      : 'foreingrecordfield',
					name       : 'customerCountryID',
					fieldLabel : 'Stát',
					store      : me.stores.countries
				}]	
			},
			
			spacer,
			
			{
				xtype : 'hfbox',
				items : [{
					xtype      : 'textfield',
					name       : 'customerEmail',
					fieldLabel : 'E-mail'	
				},{
					xtype      : 'textfield',
					name       : 'customerPhone',
					fieldLabel : 'Telefon'	
				}]	
			},
			
			spacer,
			
			{
				xtype      : 'foreingrecordfield',
				name       : 'paymentMethodID',
				fieldLabel : 'Způsob platby',
				store      : me.stores.payments,
				listeners  : {
					scope  : me,
					change : me.updateSummary
				}
			}]
		});
		
		// ================== SHIPPING =================		
		me.addTab({
			title : 'Dodací údaje',
			items : [{
				xtype : 'hfbox',
				items : [{
					xtype      : 'foreingrecordfield',
					name       : 'shippingMethodID',
					fieldLabel : 'Doprava',
					store      : me.stores.shippings,
					listeners  : {
						change : function( field, shippingID ) {
							var store      = field.store,
							    shipping   = store.getById( shippingID ),
							    prices     = shipping.prices().getRange(),
							    priceValue = 0;
							
							if( prices.length > 0 ) {
								var itemsPrice = me.itemsVatPriceFld.getValue();
								
								for( var i = 0, pl = prices.length, price; i < pl; ++i ) {
									price = prices[i];
									
									if( itemsPrice >= price.get('from') && itemsPrice < price.get('to') ) {
										priceValue = price.get('price');
										break;
									}
								}
							}
							
							console.log(priceValue);
							if( me.shippingPriceDisplay ) {
								me.shippingPriceDisplay.setValue( priceValue );
							}
							
							me.updateSummary();
						}
					}
				},{
					xtype      : 'displayfield',
					valueToRaw : function( v ) { return parseFloat( v || 0 ) +' Kč'; },
					width      : 100,
					itemId     : 'shippingPriceDisplay'
				}]
			},
			
			spacer,
			
			{
				xtype      : 'checkboxfield',
				fieldLabel : 'Odlišná doručovací adresa',
				labelWidth : 150
			},{
				xtype : 'container',
				items : [{
					xtype : 'hfbox',
					items : [{
						xtype      : 'textfield',
						name       : 'deliveryFirstName',
						fieldLabel : 'Jméno'	
					},{
						xtype      : 'textfield',
						name       : 'deliveryLastName',
						fieldLabel : 'Příjmení'	
					}]	
				},{
					xtype      : 'textfield',
					name       : 'deliveryCompanyName',
					fieldLabel : 'Název firmy'	
				},{
					xtype : 'hfbox',
					items : [{
						xtype      : 'textfield',
						name       : 'deliveryAddress',
						fieldLabel : 'Adresa, čp.',
						flex       : .7
					},{
						xtype      : 'textfield',
						name       : 'deliveryZipCode',
						fieldLabel : 'PSČ',
						labelWidth : 50,
						flex       : .3
					}]	
				},{
					xtype : 'hfbox',
					items : [{
						xtype      : 'textfield',
						name       : 'deliveryTown',
						fieldLabel : 'Město'	
					},{
						xtype      : 'foreingrecordfield',
						name       : 'deliveryCountryID',
						fieldLabel : 'Stát',
						store      : me.stores.countries
					}]	
				},{
					xtype      : 'textfield',
					name       : 'deliveryPhone',
					fieldLabel : 'Telefon'	
				}]
			}]
		});
		
		// ================== NOTES =================
		me.addTab({
			title : 'Poznámky',
			defaults : {
				labelWidth : 150,
				height : 200
			},
			
			items : [{
				xtype      : 'displayfield',
				name       : 'customerNote',
				fieldLabel : 'Poznámka od zákazníka'
				
			},{
				xtype      : 'textarea',
				name       : 'vendorNote',
				fieldLabel : 'Poznámka pro zákazníka'
			},{
				xtype      : 'textarea',
				name       : 'internalNote',
				fieldLabel : 'Interní poznámka'
			}]
		});
		
		Ext.apply( me, {
			title : 'Úprava objednávky',
			bodyPadding : 5
		});
		
		me.callParent();
		
		var bForm = me.getForm();
		me.shippingMethodID = bForm.findField( 'shippingMethodID' );
		me.paymentMethodID  = bForm.findField( 'paymentMethodID' );
	},
	
	initDataStores : function()
	{
		var me = this,
		    prefix = me.$className +'.';
		
		var shippings = me.module.createStore({
			model : prefix +'ShippingMethod',
			
			autoLoad : false,
			url : {
				request : 'form',
				name    : me.formName,
				action  : 'loadShippingMethods'
			}
		});
		shippings.load();
		
		var payments = me.module.createStore({
			model : prefix +'PaymentMethod',
			
			autoLoad : false,
			url : {
				request : 'form',
				name    : me.formName,
				action  : 'loadPaymentMethods'
			}
		});
		payments.load();
		
		var countries = me.module.createStore({
			model : prefix +'Country',
			
			autoLoad : false,
			url : {
				request : 'form',
				name    : me.formName,
				action  : 'loadCountries'
			}
		});
		countries.load();
		
		me.stores = {
			shippings : shippings,
			payments  : payments,
			countries : countries
		};
	},
	
	recalculatePrice : function( record ) {
		record.set( 'price', record.get( 'itemPrice' ) * record.get( 'amount' ) );
		record.set( 'vatPrice', record.get( 'vatPrice' ) * record.get( 'amount' ) );
	},
	
	updateSummary : function()
	{
		
		
		return;
		var me = this;
//		me.paymentPrice = me
		
		var items = itemsStore.getRange(),
		    totalPrice = 0;
		
		for( var i = 0, il = items.length; i < il; ++i ) {
			totalPrice += items[i].get('vatPrice');
		}
		
		
	},
	
	getShippingPrice : function()
	{

		
		return priceValue;
	}
	
}, function() {
	
	var me = this,
	    prefix = me.$className +'.';
	
	Ext.define( prefix +'ShippingMethod', {
		extend  : 'extAdmin.Model',
		fields  : [ 'ID', 'title' ],
		hasMany : [
			{ model : prefix +'PaymentMethod', name : 'paymentMethods' },
			{ model : prefix +'ShippingPrice', name : 'prices' }
		]
	});
	
	Ext.define( prefix +'ShippingPrice', {
		extend : 'extAdmin.Model',
		fields : [
			{ name : 'from',  type : 'float' },
			{ name : 'to',    type : 'float' },
			{ name : 'price', type : 'float' }
		],
		belongsTo : { model : prefix +'ShippingMethod', name : 'shippingMethod' }
	});
	
	Ext.define( prefix +'PaymentMethod', {
		extend : 'extAdmin.Model',
		fields : [ 'ID', 'title' ],
		hasMany : [
			{ model : prefix +'ShippingMethod', name : 'shippingMethods' },
			{ model : prefix +'Country', name : 'countries' }
		]
	});
	
	Ext.define( prefix +'Country', {
		extend : 'extAdmin.Model',
		fields : [ 'ID', 'title' ],
		hasMany : { model : prefix +'PaymentMethod', name : 'paymentMethods' }
	});
});