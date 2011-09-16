Ext.define( 'extAdmin.module.documentsOrders.EditForm',
{
	extend : 'extAdmin.component.Form',
	
	initComponent : function()
	{
		var spacer = {
			xtype  : 'container',
			height : 20
		};
		
		var orderInfo = {
			xtype : 'hfbox',
			items : [{
				xtype      : 'displayfield',
				name       : 'seriesNumber',
				fieldLabel : 'Číslo objednávky'	
			},{
				xtype      : 'displayfield',
				name       : 'createdOn',
				valueToRaw : function( v ) { return v ? Ext.util.Format.date( Ext.Date.parse( v, 'Y-m-d H:i:s' ), 'd.m.Y - h:i:s' ) : v; },
				fieldLabel : 'Datum podání'	
			}]
		};
		
		this.addTab({
			title : 'Zákazník',
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
					xtype      : 'textfield',
					name       : 'customerCountryID',
					fieldLabel : 'Stát'	
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
			}]
		});
		
		var deliveryAddress = {
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
					xtype      : 'textfield',
					name       : 'deliveryCountryID',
					fieldLabel : 'Stát'	
				}]	
			},{
				xtype      : 'textfield',
				name       : 'deliveryPhone',
				fieldLabel : 'Telefon'	
			}]
		};
		
		this.addTab({
			title : 'Doručovací údaje',
			items : [{
				xtype : 'hfbox',
				items : [{
					xtype      : 'textfield',
					name       : 'shippingMethodID',
					fieldLabel : 'Doprava',
					flex       : .7
				},{
					xtype      : 'displayfield',
					valueToRaw : function( v ) { return parseFloat( v || 0 ) +' Kč'; },
					flex       : .3
				}]
			},{
				xtype      : 'checkboxfield',
				fieldLabel : 'Odlišná doručovací adresa',
				labelWidth : 150
			},
			
			deliveryAddress
			
			]
		});
		
		this.addTab({
			title : 'Platební údaje',
			items : [{
				xtype      : 'textfield',
				name       : 'paymentMethodID',
				fieldLabel : 'Způsob platby',
			}]
		});
		
		this.addTab({
			title : 'Seznam zboží',
			items : [{
				xtype      : 'listfield',
				name       : 'items',
				
				plugins: [{
					ptype : 'gl_inlineeditor',
					editors : {
						amount : {
							xtype      : 'numberfield',
							allowblank : false
						}
					}
				}],
				
				barActions : [{
					atype : 'addempty'
				}],
				
				rowActions : [{
					atype : 'remove'
				}],
				
				options : {
					fields : [
						{ name : 'productIdentificatorID', title : '#', width : 25 },
						{ name : 'productTitle', 'title' : 'Název' },
						{ name : 'itemPrice', title : 'Cena / kus' },
						{ name : 'amount', title : 'Počet kusů' },
						{ name : 'Price', title : 'Cena' }
					]
				}
			}]
		});
		
		Ext.apply( this, {
			title : 'Úprava objednávky',
			bodyPadding : 5
		});
		
		this.callParent();
	}
});