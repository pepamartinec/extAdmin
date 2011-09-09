Ext.define( 'extAdmin.module.paymentMethods.EditForm',
{
	extend : 'extAdmin.component.Form',
	
	requires : [
	    'extAdmin.widget.form.plugin.Localizable',
	    'extAdmin.widget.form.gridList.actionButton.Remove'
	],
	
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
					name       : 'title',
					allowBlank : false,
				},{
					fieldLabel : 'Pozice',
					xtype      : 'positionfield',
					module     : this.module,
					allowBlank : false,
				},{
					fieldLabel	: 'Poplatek',
					xtype		: 'numberfield',
					name		: 'price',
					
				    // Remove spinner buttons, and arrow key and mouse wheel listeners
				    hideTrigger: true,
				    keyNavEnabled: false,
				    mouseWheelEnabled: false
				},{
					xtype      : 'checkbox',
					fieldLabel : 'Publikovat',
					boxLabel   : '',
					name       : 'publish',
					inputValue : 1,
					checked    : false
				},{
					xtype      : 'tinymce',
					setup      : 'advanced',
					fieldLabel : 'Info poznámka',
					name       : 'note'
				}]
			};
		
		this.addTab({
			title : 'Základní',
			items : [ baseInfo ]
		});
		
		this.addTab({
			title : 'Země',
			items : [ Ext.create( 'extAdmin.widget.form.CheckboxList', {
				name: 'countriesIDs',
				options: {
					fields : [
					    { name : 'ID', title : 'ID', hidden: true },
						{ name : 'name', title : 'Název' }
					],
					module: this.module,
					fetchAction: 'getCountries'
				}
			})]
		});
/*		
		this.addTab({
			title : 'Doprava',
			items : [ Ext.create( 'extAdmin.widget.form.CheckboxList', {
				name: 'shippingIDs',
				options: {
					fields : [
					    { name : 'ID', title : 'ID', hidden: true },
						{ name : 'title', title : 'Název' }
					],
					module: this.module,
					fetchAction: 'getShipping'
				}
			})]
		});
*/		
		Ext.apply( this, {
			title : 'Úprava platební metody'
		});
		
		this.callParent();

	}
	
});