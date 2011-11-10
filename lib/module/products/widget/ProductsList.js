Ext.define( 'extAdmin.module.products.widget.ProductsList',
{
	extend : 'extAdmin.widget.form.gridList.GridList',
	
	uses : [
		'extAdmin.module.products.Lookup'
	],
	
	amountEditor : true,
	
	initComponent : function()
	{
		var me = this;
		
		// setup standard actions
		if( me.barActions == null ) {
			me.barActions = [];	
		}
		
		var lookupConfig = {
			atype   : 'addlookup',
			lookup  : 'products',
			mapping : {},
			listeners : {
				add : function( items ) {
					for( var i = 0, il = items.length; i < il; ++i ) {
						me.recalculateItemPrices( items[i] );
					}
				}
			}
		};
		
		me.barActions.unshift( lookupConfig );
		
		if( me.rowActions == null ) {
			me.rowActions = [];	
		}
		
		me.rowActions.unshift({
			atype : 'remove'
		});
		
		// apply standard columns to configured ones
		var configColumns = me.columns,
		    localColumns = {
				productIdentificatorID : {
					source   : 'ID',
					dataType : 'integer',
				},
				
				unitPrice : {
					source   : { data : function( product ) { return product.getFinalPrice( false ); } },
					dataType : 'float'
				},
				
				amount : {
					source   : { data : 1 },
					dataType : 'float'
				},
				
				price : {
					source   : { data : function( product ) { return product.getFinalPrice( false ); } },
					dataType : 'float'
				},
				
				vatRateValue : {
					source   : 'vatRateValue',
					dataType : 'float'
				},
				
				vatPrice : {
					source   : { data : function( product ) { return product.getFinalPrice( true ); } },
					dataType : 'float'
				}
			};
		
		for( var idx in localColumns ) {
			if( localColumns.hasOwnProperty( idx ) === false ) {
				continue;
			}
			
			if( configColumns.hasOwnProperty( idx ) === false ) {
				configColumns[ idx ] = localColumns[ idx ];
				
			} else {
				Ext.apply( configColumns[ idx ], localColumns[ idx ] );
			}
		}
		
		var column;
		for( var idx in configColumns ) {
			if( configColumns.hasOwnProperty( idx ) === false ) {
				continue;
			}
			
			column = configColumns[ idx ];
			
			if( column.source ) {
				lookupConfig.mapping[ idx ] = column.source;
				delete column.source;
			}
			
			if( column.header == null ) {
				delete configColumns[ idx ];
			}
		}
		
		// configure amount editor
		if( me.amountEditor ) {
			if( me.plugins == null ) {
				me.plugins = [];
			}
			
			if( Ext.isObject( me.amountEditor ) === false ) {
				me.amountEditor = me.constructPlugin({
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
				});
			}
			
			me.plugins.push( me.amountEditor );
		}
		
		// setup standard footer
		me.totalPriceFld = Ext.create( 'extAdmin.widget.form.Currency', {
			disabled : true,
			readOnly : true,
			disabledCls : null
		});
		
		me.totalVatPriceFld = Ext.create( 'extAdmin.widget.form.Currency', {
			disabled : true,
			readOnly : true,
			disabledCls : null
		});
		
		if( me.dockedItems == null ) {
			me.dockedItems = [];	
		}
		
		if( me.dockedItems[0] == null ) {
			me.dockedItems[0] = {
				xtype : 'toolbar',
				dock  : 'bottom',
				items : []	
			};
		}
		
		me.dockedItems[0].items.unshift({
			xtype : 'tbfill'
		},{
			xtype : 'container',
			items : [{
				xtype      : 'fieldcontainer',
				fieldLabel : 'Cena položek',
				items      : [ me.totalPriceFld, me.totalVatPriceFld ]
			}]
		});
		
		me.callParent( arguments );
		me.on( 'datachanged', me.updateSummary, me );
	},
	
	recalculateItemPrices : function( record )
	{
		record.set( 'price', record.get( 'unitPrice' ) * record.get( 'amount' ) );
		record.set( 'vatPrice', ( record.get( 'vatRateValue' ) * 0.01 + 1 ) * record.get( 'price' ) );
		
		this.updateSummary();
	},
	
	updateSummary : function()
	{
		var me = this;
		
		var items         = me.getStore().getRange(),
		    itemsPrice    = 0.0,
		    itemsVatPrice = 0.0;
		
		for( var i = 0, il = items.length; i < il; ++i ) {
			itemsPrice    += items[i].get('price');
			itemsVatPrice += items[i].get('vatPrice');
		}		
		
		me.totalPriceFld.setValue( itemsPrice );
		me.totalVatPriceFld.setValue( itemsVatPrice );
	}
});