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
	        field,
	        fieldConfig, columnConfig;
	
		config.fields = [];
		config.columns = [];
		
		for( var dataIdx in fields ) {
			field = fields[ dataIdx ];
			
			switch( field.type ) {
				case 'date':
				case 'datecolumn':
					fieldConfig = {
						type       : 'date',
						dateFormat : field.dateFormat || "Y-m-d H:i:s"
					};
					
					columnConfig = {
						xtype  : 'datecolumn'	
					};
					break;
					
				case 'currency':
				case 'currencycolumn':
					fieldConfig = {
						type : 'float'
					};
					
					columnConfig = {
						xtype : 'currencycolumn'
					};
					
					if( field.currencyConfig ) {
						var currencyField = field.currencyField;
						
						columnConfig.currencyField = currencyField;
						
						config.field.push({
							name : currencyField
						});
					}
					break;					
			
				default:
					fieldConfig  = {};
				
					columnConfig = {
						xtype : field.type
					};
					break;
			}
			
			extAdmin.applyConfigIf( fieldConfig, {
				name         : dataIdx,
				defaultValue : field.defaultValue,
				useNull      : field.useNull
			});
			
			config.fields.push( fieldConfig );
			
			if( field.display !== false ) {
				extAdmin.applyConfigIf( columnConfig, {
					header    : field.header,
					align     : field.align,
					dataIndex : dataIdx,
					width     : field.width,
					flex      : field.width ? false : true,
					sortable  : field.sortable,
					groupable : field.groupable,
					hideable  : field.hideable || field.hidden,
					hidden    : field.hidden,
					editor    : field.editor,
					menuDisabled : field.disableMenu
				});
				
				config.columns.push( columnConfig );
			}
		}
		
		Ext.applyIf( config, {
			extend : 'extAdmin.Model'
		});
		
		Ext.define( name, config );
	}
}

}, function() {

	// define custom data-types
	Ext.data.Types.DATETIME = {
		type     : 'datetime',
		convert  : function( v ) { return v ? Ext.Date.parse( v, 'Y-m-d H:i:s' ) : null; },
		sortType : Ext.data.SortTypes.asDate
	};
	
});