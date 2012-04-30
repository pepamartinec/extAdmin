Ext.define( 'extAdmin.widget.form.FilesGridList',
{
	extend : 'extAdmin.widget.form.gridList.GridList',
	
	alias : 'widget.fileslistfield',
	
	requires : [
		'extAdmin.component.RepositoryBrowser'
	],
	
	texts : {
		addBtn : 'Přidat soubor'
	},
	
	initComponent : function()
	{
		Ext.applyIf( this, {
			columns : {
				ID     : { header : '#', width : 25 },
				title  : { title : 'Název' },
				fileID : { hidden : true }
			},
			
			barActions : [{
				atype   : 'addlookup',
				lookup  : 'repository',
				
				mapping : {
					ID     : { data : null },
					fileID : 'ID',
					title  : { data : function( record ) {
						var icon = 'images/mimetypes/16/'+ record.data.mimeType.replace('/','-') +'.png';
						return '<img src="'+ icon +'" /> <a href="'+ record.data.href +'" target="_blank">'+ record.data.title +'</a>';
					} }
				},
				
				listeners : {
					beforeadd : function( store, item ) {							
						return store.findExact( 'fileID', item['fileID'] ) == -1;
					}
				}
			}],
			
			rowActions : [{
				atype : 'remove'
			}]
		});
		
		this.callParent( arguments );
	}
});