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
		
		var fakeDirty = function() { return false; };
		
		
		var firstNameField = Ext.create( 'Ext.form.field.Text', {
			name       : 'customerFirstName',
			fieldLabel : 'Jméno'	
		});
		
		var lastNameField = Ext.create( 'Ext.form.field.Text', {
			name       : 'customerLastName',
			fieldLabel : 'Příjmení'	
		});
		
		var companyNameField = Ext.create( 'Ext.form.field.Text', {
			name       : 'customerCompanyName',
			fieldLabel : 'Název firmy'	
		});
		
		var emailField = Ext.create( 'Ext.form.field.Text', {
			name       : 'customerEmail',
			fieldLabel : 'E-mail'	
		});
		
		var phoneField = Ext.create( 'Ext.form.field.Text', {
			name       : 'customerPhone',
			fieldLabel : 'Telefon'	
		});
		
		
		
		var titleNameField = Ext.create( 'Ext.form.field.Display', {
			fieldLabel : 'Zákazník',
			refresh : function() {
				var name    = Ext.String.trim( firstNameField.getValue() +' '+ lastNameField.getValue() ),
				    company = companyNameField.getValue(),
				    value;
				
				if( company ) {
					value = company;
					
					if( name ) {
						value += ' ('+ name +')';
					}
					
				} else {
					value = name;
				}
				
				this.setValue( value );
			}
		});
		
		firstNameField.on( 'change', titleNameField.refresh, titleNameField );
		lastNameField.on( 'change', titleNameField.refresh, titleNameField );
		companyNameField.on( 'change', titleNameField.refresh, titleNameField );
		
		var titleContactField = Ext.create( 'Ext.form.field.Display', {
			fieldLabel : 'Kontakt',
			refresh : function() {				
				var email = emailField.getValue(),
				    phone = phoneField.getValue(),
				    values = [];
				
				if( phone ) {
					values.push( phone )
				}
				
				if( email ) {
					values.push( email );
				}
				
				this.setValue( values.join(', ') );
			}
		});
		
		emailField.on( 'change', titleContactField.refresh, titleContactField );
		phoneField.on( 'change', titleContactField.refresh, titleContactField );
		
		
		
		
		
		me.initDataStores();
		
		// ================== ITEMS LIST =================
		me.itemsPriceFld = Ext.create( 'extAdmin.widget.form.Currency', {
			disabled : true,
			readOnly : true,
			disabledCls : null
		});
		
		me.itemsVatPriceFld = Ext.create( 'extAdmin.widget.form.Currency', {
			disabled : true,
			readOnly : true,
			disabledCls : null
		});
		
		me.shippingPriceFld = Ext.create( 'extAdmin.widget.form.Currency', {
			fieldLabel : 'Poštovné',
			labelAlign : 'right',
			disabled   : true,
			readOnly : true,
			disabledCls : null
		});
		
		me.paymentPriceFld = Ext.create( 'extAdmin.widget.form.Currency', {
			fieldLabel : 'Platební příplatek',
			labelAlign : 'right',
			disabled   : true,
			readOnly : true,
			disabledCls : null
		});
		
		me.totalVatPriceFld = Ext.create( 'extAdmin.widget.form.Currency', {
			fieldLabel : '<b>Celkem</b>',
			labelAlign : 'right',
			disabled   : true,
			readOnly : true,
			disabledCls : null
		});
		
		me.itemsList = Ext.create( 'extAdmin.widget.form.gridList.GridList', {
			name   : 'items',
			height : 500,
			
			plugins: [{
				ptype : 'gl_inlineeditor',
				editors : {
					amount : {
						xtype      : 'numberfield',
						allowblank : false,
						minValue   : 0.0001
					}
				},
				listeners : {
					edit : function( editor, e ) {
						me.recalculateItemPrices( e.record );
					}
				}
			}],
			
			barActions : [{
				atype   : 'addlookup',
				lookup  : 'products',
				mapping : {
					productIdentificatorID : 'ID',
					productTitle           : 'title',
					unitPrice              : { data : function( product ) { return product.getFinalPrice( false ); } },
					amount                 : { data : 1 },
					price                  : { data : function( product ) { return product.getFinalPrice( false ); } },
					vatRateValue           : 'vatRateValue'
				},
				listeners : {
					add : function( items ) {
						for( var i = 0, il = items.length; i < il; ++i ) {
							me.recalculateItemPrices( items[i] );
						}
					}
				}
			}],
			
			rowActions : [{
				atype : 'remove'
			}],
			
			columns : {
				productIdentificatorID : { header : '#', width : 35 },
				productTitle           : { header : 'Název' },
				unitPrice              : { header : 'Cena / kus (bez DPH)', width : 125, dataType : 'float', type : 'currencycolumn' },
				amount                 : { header : 'Počet jednotek',       width : 86,  dataType : 'float', type : 'numbercolumn', align : 'right' },
				price                  : { header : 'Cena (bez DPH)',       width : 125, dataType : 'float', type : 'currencycolumn' },
				vatPrice               : { header : 'Cena (s DPH)',         width : 125, dataType : 'float', type : 'currencycolumn' }
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
		});
		
		me.addTab({
			title : 'Seznam zboží',
			items : [{
					xtype : 'hiddenfield',
					name  : 'ID'
				},{
					xtype : 'hfbox',
					items : [{
						xtype      : 'displayfield',
						fieldLabel : 'Číslo objednávky',
						name       : 'seriesNumber'
					}, titleNameField ]
				},
				titleContactField,
				spacer,
				me.itemsList
			]
		});
		
		// ================== PAYMENT =================
		me.paymentMethodIdFld = Ext.create( 'extAdmin.widget.form.ForeingRecord', {
			name       : 'paymentMethodID',
			fieldLabel : 'Způsob platby',
			store      : me.stores.payments,
			autoReload : false,
			listeners  : {
				scope  : me,
				change : me.updatePaymentPrice
			}
		});
		
		me.paymentMethodPriceDisplay = Ext.create( 'Ext.form.field.Display', {
			isDirty    : fakeDirty,
			valueToRaw : function( v ) { return parseFloat( v || 0 ) +' Kč'; },
			width      : 100,
			listeners  : {
				scope  : me,
				change : me.updateSummary
			}
		});
		
		me.addTab({
			title : 'Platební údaje',
			items : [{
				xtype : 'hfbox',
				items : [ firstNameField, lastNameField ]	
			},
			
			companyNameField,
			
			{
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
					autoReload : false,
					store      : me.stores.countries
				}]	
			},
			
			spacer,
			
			{
				xtype : 'hfbox',
				items : [ emailField, phoneField ]	
			},
			
			spacer,
			
			{
				xtype : 'hfbox',
				items : [ me.paymentMethodIdFld, me.paymentMethodPriceDisplay ]
			}]
		});
		
		// ================== SHIPPING =================
		me.shippingMethodIdFld = Ext.create( 'extAdmin.widget.form.ForeingRecord', {
			name       : 'shippingMethodID',
			fieldLabel : 'Způsob dopravy',
			store      : me.stores.shippings,
			autoReload : false,
			listeners  : {
				scope  : me,
				change : me.updateShippingPrice
			}
		});
		
		me.shippingMethodPriceDisplay = Ext.create( 'Ext.form.field.Display', {
			isDirty    : fakeDirty,
			valueToRaw : function( v ) { return parseFloat( v || 0 ) +' Kč'; },
			width      : 100,
			listeners  : {
				scope  : me,
				change : me.updateSummary
			}
		});
		
		me.shippingAddressSet = Ext.create( 'Ext.container.Container', {
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
					autoReload : false,
					store      : me.stores.countries
				}]	
			},{
				xtype      : 'textfield',
				name       : 'deliveryPhone',
				fieldLabel : 'Telefon'	
			}]
		});
		
		me.customShippingAddressChbox = Ext.create( 'Ext.form.field.Checkbox', {
			fieldLabel : 'Doručovací adresa shodná s fakturační',
			name       : 'deliverySameAsCustomer',
			labelWidth : 200,
			setValue : function( value ) {
				var items = me.shippingAddressSet.items.items;
				
				for( var i = 0, il = items.length; i < il; ++i ) {
					items[i].setDisabled( value !== '0' && !!value );
				}
				
				return Ext.form.field.Checkbox.prototype.setValue.apply( this, arguments );
			}
		});
		
		me.addTab({
			title : 'Dodací údaje',
			items : [
				me.customShippingAddressChbox,
				me.shippingAddressSet,
				spacer,
				{
					xtype : 'hfbox',
					items : [ me.shippingMethodIdFld, me.shippingMethodPriceDisplay ]
				}
			]
		});
		
		// ================== NOTES =================
		me.addTab({
			title : 'Poznámky',
			defaults : {
				labelWidth : 150,
				height : 100
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
			
			autoLoad : true,
			remoteSort   : false,
			remoteFilter : false,
			
			url : {
				request : 'form',
				name    : me.formName,
				action  : 'loadShippingMethods'
			}
		});
		
		var payments = me.module.createStore({
			model : prefix +'PaymentMethod',
			
			autoLoad : true,
			remoteSort   : false,
			remoteFilter : false,
			
			url : {
				request : 'form',
				name    : me.formName,
				action  : 'loadPaymentMethods'
			}
		});
		
		var countries = me.module.createStore({
			model : prefix +'Country',
			
			autoLoad : true,
			remoteSort   : false,
			remoteFilter : false,
			
			url : {
				request : 'form',
				name    : me.formName,
				action  : 'loadCountries'
			}
		});
		
		me.stores = {
			shippings : shippings,
			payments  : payments,
			countries : countries
		};
	},
	
	recalculateItemPrices : function( record ) {
		record.set( 'price', record.get( 'unitPrice' ) * record.get( 'amount' ) );
		record.set( 'vatPrice', ( record.get( 'vatRateValue' ) * 0.01 + 1 ) * record.get( 'price' ) );
		
		this.updateSummary();
	},
	
	updatePaymentPrice : function()
	{
		var me         = this,
		    field      = me.paymentMethodIdFld,
		    paymentID  = field.getValue();
		
		if( paymentID == null ) {
			return null;
		}
		
		var payment    = me.stores.payments.getById( paymentID ),
		    priceValue = payment.get('price');
		
		this.paymentMethodPriceDisplay.setValue( priceValue );
		return priceValue;
	},
	
	updateShippingPrice : function()
	{
		var me         = this,
		    field      = me.shippingMethodIdFld,
		    shippingID = field.getValue();
		
		if( shippingID == null ) {
			return null;
		}
		
		var shipping   = field.store.getById( shippingID ),
		    prices     = shipping.prices().getRange(),
		    priceValue = 0;
		
		if( prices.length > 0 ) {
			var itemsPrice = me.itemsVatPriceFld.getValue(),
			    priceFrom, priceTo;
			
			for( var i = 0, pl = prices.length, price; i < pl; ++i ) {
				price = prices[i];
				
				priceFrom = price.get('from');
				proceTo   = price.get('to');
				
				if( itemsPrice >= priceFrom && ( itemsPrice < priceTo || Ext.isNumber( priceTo ) === false ) ) {
					priceValue = price.get('price');
					break;
				}
			}
		}
		
		me.shippingMethodPriceDisplay.setValue( priceValue );
		return priceValue;
	},
	
	updateSummary : function()
	{
		var me = this;
		
		var store = me.itemsList.getStore(),
		    items = store.getRange(),
		    itemsPrice    = 0.0,
		    itemsVatPrice = 0.0;
		
		for( var i = 0, il = items.length; i < il; ++i ) {
			itemsPrice    += items[i].get('price');
			itemsVatPrice += items[i].get('vatPrice');
		}		
		
		me.itemsPriceFld.setValue( itemsPrice );
		me.itemsVatPriceFld.setValue( itemsVatPrice );
		
		var paymentPrice  = me.updatePaymentPrice(),		
		    shippingPrice = me.updateShippingPrice();
		
		me.paymentPriceFld.setValue( paymentPrice );
		me.shippingPriceFld.setValue( shippingPrice );
		
		var totalVatPrice = itemsVatPrice + paymentPrice + shippingPrice;
		me.totalVatPriceFld.setValue( totalVatPrice );
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
		fields : [
			{ name : 'ID',    type : 'string' },
			{ name : 'title', type : 'string' },
			{ name : 'price', type : 'float' }
		],
		hasMany : [
			{ model : prefix +'ShippingMethod', name : 'shippingMethods' },
			{ model : prefix +'Country',        name : 'countries' }
		]
	});
	
	Ext.define( prefix +'Country', {
		extend : 'extAdmin.Model',
		fields : [ 'ID', 'title' ],
		hasMany : { model : prefix +'PaymentMethod', name : 'paymentMethods' }
	});
});