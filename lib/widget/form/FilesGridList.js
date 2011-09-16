Ext.define( 'extAdmin.widget.form.FilesGridList',
{
	extend : 'extAdmin.widget.form.gridList.GridList',
	
	alias : 'widget.fileslistfield',
	
	requires : [
		'extAdmin.widget.form.gridList.actionButton.Remove'
	],
	
	texts : {
		addBtn : 'Přidat soubor'
	},
	
	initComponent : function()
	{
		this.options = this.options || {};
		
		this.rowActions = [{ atype : 'remove' }];
		
		Ext.applyIf( this.options, {
			fields : [
				{ name : 'ID', title : '#', width : 25 },
				{ name : 'fileID' },
				{ name : 'title', title : 'Název' }
			],
			
			itemsLookup : {
				popup : {
					panel : {
						xtype : 'repositorybrowser',
						uploadPopup : {}
					},
					
					mapping : {
						'ID'     : { initial : null },
						'fileID' : 'ID',
						'title'  : {
							dataID  : function( record ) {
								var icon = 'images/mimetypes/16/'+ record.data.mimeType.replace('/','-') +'.png';
								return '<img src="'+ icon +'" /> <a href="'+ record.data.href +'" target="_blank">'+ record.data.title +'</a>';
							}
						}
					}
				},
				
				button : {
					text    : this.texts.addBtn,
					iconCls : 'i-add'
				}
			}			
		});
		
		this.callParent( arguments );
	}
});