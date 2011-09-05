Ext.define( 'extAdmin.App',
{
	extend : 'inspirio.widget.container.Viewport',
	
	requires : [
	    'inspirio/*',
	            
		'Ext.layout.container.Fit',
	            
		'extAdmin.ModuleManager',
	
		'extAdmin.component.DataList',
		'extAdmin.component.dataList.Tree',
		'extAdmin.component.dataList.Grid',
		'extAdmin.component.dataList.TreeGrid',
		'extAdmin.component.GalleryBrowser',
	
		// grids
		'extAdmin.action.Form',
		'extAdmin.action.Remove',
	
		'extAdmin.widget.grid.column.Localizations',
		
		// form widgets
		'extAdmin.widget.form.Image',
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
		me.module = Ext.create( 'extAdmin.component.DataList', {
			module : extAdmin.ModuleManager.get( moduleName )
		});
		
		me.add( me.module );
	}
});