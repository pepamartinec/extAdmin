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
	        field;
	
		config.fields = [];
		config.columns = [];
		
		for( var dataIdx in fields ) {
			field = fields[ dataIdx ];
			
			config.fields.push({
				name         : dataIdx,
				type         : field.dataType || 'auto',
				defaultValue : field.defaultValue,
				dateFormat   : field.dateFormat || "Y-m-d H:i:s"
			});
			
			if( field.hasOwnProperty('display') && field.display == false ) {
				continue;
			}
			
			config.columns.push({
				xtype     : field.type,
				header    : field.header || '&#160;',
				dataIndex : dataIdx,
				width     : field.width,
				flex      : field.width ? false : true,
				align     : field.align || 'left',
				sortable  : field.sortable,
				groupable : field.groupable,
				hideable  : field.hideable || field.hidden,
				hidden    : field.hidden,
				tpl       : field.tpl,
				menuDisabled : field.disableMenu
			});
		}
		
		Ext.applyIf( config, {
			extend : 'extAdmin.Model'
		});
		
		Ext.define( name, config );
	}
}
});