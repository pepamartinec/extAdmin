Ext.define( 'extAdmin.module.staticPages.EditForm',
{
	extend : 'extAdmin.component.form.Form',

	isLocalizable : true,
	
	initComponent : function()
	{
		var albumIdField = Ext.create( 'Ext.form.field.Hidden', {
			name : 'albumID'
		});
		
		var titleField = Ext.create( 'Ext.form.field.Text', {
			xtype      : 'textfield',
			fieldLabel : 'Název',
			name       : 'title',
			allowBlank : false
		});
		
		var baseInfo = {
			xtype: 'fieldset',
			title: 'Základní informace',
			items: [{
				xtype: 'hidden',
				name: 'ID'
			},{
				xtype: 'hidden',
				name: 'parentID'
			},
			albumIdField,
			titleField,
			{
				fieldLabel: 'URL adresa',
				name: 'urlName',
				xtype: 'urlfield',
				sourceField : titleField
			},{
				xtype: 'fieldcontainer',
				layout : 'hbox',
				fieldLabel: 'Platnost',
				labelSeparator : '',
				items: [{
					xtype: 'datefield',
					fieldLabel : 'od',
					labelWidth : 20,
					labelAlign : 'right',
					name: 'validFrom',
					flex : 1
				},{
					xtype: 'datefield',
					fieldLabel : 'do',
					labelWidth : 40,
					labelAlign : 'right',
					name: 'validTo',
					flex : 1
				}]
			},{
				fieldLabel : 'Pozice',
				xtype      : 'positionfield',
				module     : this.module
			},{
				xtype      : 'checkbox',
				fieldLabel : 'Publikovat',
				boxLabel   : '',
				name       : 'publish',
				inputValue : 1,
				checked    : true
			}]
		};
		
		var pageContent = {
			xtype: 'fieldset',
			title: 'Obsah stránky',
			items: [{
				fieldLabel   : 'Titulní obrázek',
				name         : 'titleImageID',
				xtype        : 'imagefield',
				module       : this.module,
				albumIdField : albumIdField
			},{
				xtype      : 'tinymce',
				setup      : 'simple',
				fieldLabel : 'Perex',
				name       : 'perex'
			},{
				xtype      : 'tinymce',
				setup      : 'advanced',
				fieldLabel : 'Obsah',
				name       : 'content'
			}]
		};
		
		this.addTab({
			title : 'Základní',
			items : [ baseInfo, pageContent ]
		});
		
		this.addTab({
			title : 'Meta info',
			items : [{
				xtype      : 'textfield',
				fieldLabel : 'Klíčová slova',
				name       : 'keywords'
			},{
				xtype      : 'textarea',
				fieldLabel : 'Popis',
				name       : 'description'
			}]
		});
		
		Ext.apply( this, {
			title : 'Úprava stránky'
		});		
		
		this.callParent();
	}
});