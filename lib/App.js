Ext.define( 'extAdmin.App',
{
	extend : 'inspirio.widget.container.Viewport',
	
	requires : [
	    'inspirio/*',
	            
		'Ext.layout.container.Fit',
	            
		'extAdmin.ModuleManager',
	
		'extAdmin.component.dataBrowser.DataBrowser',
		'extAdmin.component.dataBrowser.dataList.Tree',
		'extAdmin.component.dataBrowser.dataList.Grid',
		'extAdmin.component.dataBrowser.dataList.TreeGrid',
		'extAdmin.component.GalleryBrowser',
		
		'extAdmin.widget.grid.column.Localizations',
		
		// form widgets
		'extAdmin.widget.form.Image',
		'extAdmin.widget.form.ForeingRecord',
		'extAdmin.widget.form.Position',
		'extAdmin.widget.form.UrlName',
		'extAdmin.widget.form.gridList.GridList',
		'extAdmin.widget.form.FilesGridList',
		'extAdmin.widget.form.tinyMce.TinyMce'
	],
	
	constructor: function( config )
	{
		var me = this;
		
		Ext.apply( config, {
			layout : 'fit',
			module : null
		});
		
		me.callParent( arguments );
	},
	
	openModule : function( moduleName )
	{
		var me = this;
		
		// remove old module
		if( me.module != null ) {
			me.remove( me.module, true );
		}
		
		// launch new module
		me.module = Ext.create( 'extAdmin.component.dataBrowser.DataBrowser', {
			module : extAdmin.ModuleManager.get( moduleName )
		});
		
		me.add( me.module );
	}
});