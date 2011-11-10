Ext.define( 'extAdmin.module.documentsStore.EditForm',
{
	extend : 'extAdmin.component.form.Form',
	
	requires : [
		'extAdmin.module.products.widget.ProductsList'
	],
	
	initComponent : function()
	{
		var me = this;
		
		var spacer = {
			xtype  : 'container',
			height : 20
		};
		
		me.itemsList = Ext.create( 'extAdmin.module.products.widget.ProductsList', {
			name   : 'items',
			height : 500,
			
			columns : {
				productIdentificatorID : {
					header : '#',
					width  : 35
				},
				
				productTitle : {
					header : 'Název',
					source : 'title'
				},
				
				unitPrice : {
					header   : 'Cena / kus (bez DPH)',
					width    : 125,
					dataType : 'float',
					type     : 'currencycolumn'
				},
				
				amount : {
					header : 'Počet jednotek',
					width  : 86,
					type   : 'numbercolumn',
					align  : 'right'
				},
				
				price : {
					header : 'Cena (bez DPH)',
					width  : 125,
					type   : 'currencycolumn'
				},
				
				vatPrice : {
					header : 'Cena (s DPH)',
					width  : 125,
					type   : 'currencycolumn'
				}
			}
		});
		
		me.addTab({
			title : 'Obecné',
			items : [{
				xtype : 'hiddenfield',
				name  : 'ID'
			},{
				xtype : 'hfbox',
				items : [{
					xtype      : 'textfield',
					name       : 'seriesNumber',
					fieldLabel : 'Číslo dokladu',
					readOnly   : true
				},{
					xtype      : 'datefield',
					name       : 'createdOn',
					fieldLabel : 'Datum založení'
				},{
					xtype      : 'foreingrecordfield',
					name       : 'typeID',
					fieldLabel : 'Pohyb',
					allowBlank : false,
					data       : [
						{ ID : 1, title : 'příjemka' },
						{ ID : 2, title : 'výdejka' },
					]
				}]
			
			}, spacer, {
				xtype      : 'textarea',
				name       : 'internalNote',
				fieldLabel : 'Poznámka'
					
			}, spacer, me.itemsList ]
		});
		
		me.callParent( arguments );
	}
	
});