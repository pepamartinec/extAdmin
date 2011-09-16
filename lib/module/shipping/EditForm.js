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
			
			options: {
				fields : [
					{ name : 'ID',    title : '#', width : 25, hidden: true },
					{ name : 'from',  title: "od",    type: "numbercolumn", format : "0.00" },
					{ name : 'to',    title: "do",    type: "numbercolumn", format : "0.00" },
					{ name : 'price', title : 'Cena', type: "numbercolumn", format : "0.00" }
				]
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