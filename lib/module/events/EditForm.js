Ext.define( 'extAdmin.module.events.EditForm',
{
	extend : 'extAdmin.component.form.Form',
	
	initComponent : function()
	{
		var me = this;
		
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
				xtype : 'hidden',
				name  : 'ID'
			},{
				xtype : 'hidden',
				name  : 'categoryID'
			},
			albumIdField,
			titleField,
			{
				fieldLabel  : 'URL adresa',
				name        : 'urlName',
				xtype       : 'urlfield',
				sourceField : titleField
				
			},{
				xtype          : 'fieldcontainer',
				layout         : 'hbox',
				fieldLabel     : 'Platnost',
				labelSeparator : '',
				items: [{
					xtype      : 'datefield',
					fieldLabel : 'od',
					labelWidth : 20,
					labelAlign : 'right',
					name       : 'dateFrom',
					allowBlank : false,
					flex       : 1
					
				},{
					xtype      : 'datefield',
					fieldLabel : 'do',
					labelWidth : 40,
					labelAlign : 'right',
					name       : 'dateTo',
					flex       : 1
				}]
			
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
			title: 'Obsah',
			items: [{
				fieldLabel   : 'Titulní obrázek',
				name         : 'titleImageID',
				xtype        : 'imagefield',
				module       : me.module,
				albumIdField : albumIdField
				
			},{
				xtype      : 'textarea',
				fieldLabel : 'Perex',
				name       : 'perex'
				
			},{
				xtype      : 'tinymce',
				setup      : 'advanced',
				fieldLabel : 'Obsah',
				name       : 'content'
			}]
		};
		
		me.addTab({
			title : 'Základní',
			items : [ baseInfo, pageContent ]
		});
		
		me.addTab({
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
		
		Ext.apply( me, {
			title : 'Úprava textu'
		});		
		
		me.callParent( arguments );
	}
});