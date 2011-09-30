Ext.define( 'extAdmin.Model',
{
	extend : 'Ext.data.Model',
	
	columns : null,
	
	idProperty : 'ID',
	
statics : {
	
	createAnonymous : function( ownerClass, config )
	{
		var name = ownerClass.$className +'.AnonymousModel-'+ Ext.id();
		extAdmin.Model.create( name, config );
		
		return name;
	},
	
	/**
	 * Register new model using simplified configuration
	 * 
	 * @static
	 * @param {String} name
	 * @param {Objects} config
	 */
	create : function( name, config )
	{
		var fields = config.fields || {},
	        field, column;
	
		config.fields = [];
		config.columns = [];
		
		for( var dataIdx in fields ) {
			field = fields[ dataIdx ];
			
			config.fields.push({
				name         : dataIdx,
				type         : field.dataType || 'auto',
				defaultValue : field.defaultValue,
				dateFormat   : field.dateFormat || "Y-m-d H:i:s",
				useNull		 : field.useNull || false
			});
			
			if( field.hasOwnProperty('display') && field.display == false ) {
				continue;
			}
			
			column = {
				xtype     : field.type,
				header    : field.header || '&#160;',
				dataIndex : dataIdx,
				width     : field.width,
				flex      : field.width ? false : true,
				sortable  : field.sortable,
				groupable : field.groupable,
				hideable  : field.hideable || field.hidden,
				hidden    : field.hidden,
				tpl       : field.tpl,
				editor    : field.editor,
				menuDisabled : field.disableMenu
			};
			
			if( field.align !== undefined ) {
				column.align = field.align;
			}
			
			config.columns.push( column );
		}
		
		Ext.applyIf( config, {
			extend : 'extAdmin.Model'
		});
		
		Ext.define( name, config );
	}
}
});