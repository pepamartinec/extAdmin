Ext.define( 'extAdmin.module.shipping.EditForm',
{
	extend : 'extAdmin.component.Form',
	
	requires : ['extAdmin.widget.form.plugin.Localizable'],
	
	plugins : [{
		ptype : 'localizable'
	}],
	
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
		
		var editing	= Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit : 1
		});
		
		var pricesGridList = Ext.create( 'extAdmin.widget.form.gridList.GridList', { 
			options: {
				fields : [
					{ name : 'ID', title : '#', width : 25 },
					{ name : 'from', title: "od", type: "numbercolumn", format : "0.00", editor: { xtype: 'numberfield'} },
					{ name : 'to', title: "do", type: "numbercolumn", format : "0.00", editor: { xtype: 'numberfield'} },
					{ name : 'price', title : 'Cena', type: "numbercolumn", format : "0.00", editor: { xtype: 'numberfield'} }
				],
				
				actions : [
					Ext.create( 'extAdmin.widget.form.gridList.actionButton.Remove', function( rowIdx ) {
						pricesGridList.getStore().removeAt( rowIdx );
					}, this )
				]
			},
		
			name: "prices",
			
			plugins: [
		        editing
		    ],
		    
		    dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    icon: 'images/administration/icons/add.png',
                    text: "Přidat novou",
                    handler: function(){
                    	       
                    	var record = new shippingPrice();          	
                    	editing.cancelEdit();
                    	pricesGridList.getStore().insert( 0, record );
                    	editing.startEditByPosition({
				            row: 0,
				            column: 1
				        });
                    }
                }]
            }]
		});
		
		var pricesInfo = {
			xtype 	: "fieldset",
			title	: "Ceny",
			items	: [
				pricesGridList
			]
			
		}
		
		this.addTab({
			title : 'Základní',
			items : [ baseInfo, pricesInfo ]
		});
		
		Ext.apply( this, {
			title : 'Úprava poštovného'
		});
		
		this.callParent();
	}
});

Ext.define('shippingPrice', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'from', type: 'float', defaultValue: 0},
        {name: 'to', type: 'float', useNull: true},
        {name: 'price', type: 'float', defaultValue: 0}
    ]
});