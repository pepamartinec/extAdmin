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
					{ name : 'ID', title : '#', width : 25, hidden: true },
					{ name : 'from', title: "od", type: "numbercolumn", format : "0.00", editor: { xtype: 'numberfield'} },
					{ name : 'to', title: "do", type: "numbercolumn", format : "0.00", editor: { xtype: 'numberfield'} },
					{ name : 'price', title : 'Cena', type: "numbercolumn", format : "0.00", editor: { xtype: 'numberfield'} }
				],
				
				actions : [
					Ext.create( 'extAdmin.widget.form.gridList.actionButton.Remove', function( rowIdx ) {
						pricesGridList.getStore().removeAt( rowIdx );
					}, this )
				],
		
				editing : {
					newButton: {
						icon: 'images/administration/icons/add.png',
	                    text: "Přidat novou"
					},
					fields		: {
					     ID		: { type: 'int', useNull: true },
					     from	: { type: 'float', defaultValue: 0},
					     to		: { type: 'float', useNull: true},
					     price	: { type: 'float', defaultValue: 0}
					}
				}
			},
		
			name: "prices"
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