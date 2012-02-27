Ext.define( 'extAdmin.module.products.widget.ProductsList',
{
	extend : 'extAdmin.widget.form.gridList.GridList',
	
	requires : [
		'Ext.window.MessageBox'
	],
	
	uses : [
		'extAdmin.module.products.Lookup'
	],
	
	cls : Ext.baseCSSPrefix +'products-list',
	
	amountEditor : true,
	
	initComponent : function()
	{
		var me = this;
		
		
		// ========== SETUP STANDARD ACTIONS ==========
		
		// top-bar
		if( me.barActions == null ) {
			me.barActions = [];	
		}
		
		var lookupConfig = {
			atype   : 'addlookup',
			lookup  : 'products',
			mapping : {}
		};
		
		me.barActions.unshift( lookupConfig );
		
		// row actions
		if( me.rowActions == null ) {
			me.rowActions = [];
		}
		
		me.rowActions.unshift({
			atype : 'remove'
		});
		
		
		// ========== COLUMNS SETUP ==========
		
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
				},
				
				originalVatRateValue : {
					source   : 'vatRateValue',
					dataType : 'float'
				},
				
				originalUnitPrice : {
					source   : { data : function( product ) { return product.getFinalPrice( false ); } },
					dataType : 'float'
				}
			};
		
		// apply standard columns to configured ones
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
		
		// ========== SETUP EDITORS ==========
		if( me.amountEditor || me.editablePrice ) {
			if( me.plugins == null ) {
				me.plugins = [];
			}
			
			var editors = {};
			
			// configure amount editor
			if( me.amountEditor ) {
				editors.amount = {
					xtype      : 'numberfield',
					allowblank : false,
					minValue   : 0.0001,
					updateRecord : me.onAmountChange
				}
			}
			
			// configure price editors			
			if( me.editablePrice ) {
				var priceEditor = function( editHandler ) {
					this.updateRecord = editHandler;
				};
				
				priceEditor.prototype = {
					xtype      : 'numberfield',
					allowblank : false,
					minValue   : 0.0001
				}
				
				editors.unitPrice = new priceEditor( me.onUnitPriceChange );
				editors.price     = new priceEditor( me.onPriceChange );
				editors.vatPrice  = new priceEditor( me.onVatPriceChange );
				
				// add price-reset action
				me.rowActions.unshift({
					xtype   : 'action',
					tooltip : 'Obnovit standardní ceny',
					iconCls : 'i-arrow-rotate-anticlockwise',
					handler : function( grid, rowIdx ) {
						var record = me.getStore().getAt( rowIdx ),
						    isRevertable = record != null && (
						    	record.get('unitPrice')    != record.get( 'originalUnitPrice' ) ||
						    	record.get('vatRateValue') != record.get( 'originalVatRateValue' )
						    )
						
						if( isRevertable == false ) {
							return;
						}
						
						Ext.MessageBox.confirm( 'Potvrzení akce', 'Opravdu chcete obnovit výchozí ceny položky?', function( btn ) {
							if( btn == 'ok' || btn == 'yes' ) {								
								record.set( 'unitPrice', record.get( 'originalUnitPrice' ) );
								record.set( 'vatRateValue', record.get( 'originalVatRateValue' ) );
								
								me.calculate.priceFromUnitPrice( record );
								me.calculate.vatPriceFromPrice( record );
								me.updateSummary();
							}
						});
					}
				});
			}
			
			// construct grid-editor plugin
			me.rowEditor = me.constructPlugin({
				ptype     : 'gl_inlineeditor',
				editors   : editors,
				listeners : {
					edit : function( editor, e ) {
						e.column.getEditor().updateRecord.call( me, e.record );
						me.updateSummary();
					}
				}
			});
			
			me.plugins.push( me.rowEditor );
		}
		
		
		// ========== SETUP STANDARD FOOTER ==========
		
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
		
		me.dockedItems = [{
			xtype  : 'toolbar',
			dock  : 'bottom',			
			items : [{
				xtype : 'tbfill'
				
			},{
				xtype : 'tbtext',
				text  : 'Cena celkem:'
					
			}, me.totalPriceFld, {
				
				xtype : 'tbtext',
				text  : 'bez DPH',
				cls   : 'note',
				width : 50
					
			} , me.totalVatPriceFld, {
				
				xtype : 'tbtext',
				cls   : 'note',
				text  : 's DPH'
			}]
		}];
		
		// ========== SETUP SELF ==========
		
		me.callParent( arguments );
		me.on( 'datachanged', me.updateSummary, me );
	},
	
	// price convertors
	calculate : {
		_base : function( record, target, value ) { record.set( target, Math.round( value * 100 ) / 100 ); },
		unitPriceFromPrice : function( record ) { this._base( record, 'unitPrice', record.get( 'price' ) / record.get( 'amount' ) ); },
		priceFromUnitPrice : function( record ) { this._base( record, 'price', record.get( 'unitPrice' ) * record.get( 'amount' ) ); },
		priceFromVatPrice  : function( record ) { this._base( record, 'price', record.get( 'vatPrice' ) / ( record.get( 'vatRateValue' ) * 0.01 + 1 ) ); },
		vatPriceFromPrice  : function( record ) { this._base( record, 'vatPrice', record.get( 'price' ) * ( record.get( 'vatRateValue' ) * 0.01 + 1 ) ); }
	},
	
	onUnitPriceChange : function( record )
	{
		this.calculate.priceFromUnitPrice( record );
		this.calculate.vatPriceFromPrice( record );
	},
	
	onPriceChange : function( record )
	{
		this.calculate.unitPriceFromPrice( record );
		this.calculate.vatPriceFromPrice( record );
	},
	
	onVatPriceChange : function( record )
	{
		this.calculate.priceFromVatPrice( record );
		this.calculate.unitPriceFromPrice( record );
	},
	
	onAmountChange : function( record )
	{
		this.calculate.priceFromUnitPrice( record );
		this.calculate.vatPriceFromPrice( record );
	},
	
	// summary calculator
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