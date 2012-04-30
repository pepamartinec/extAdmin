/**
 * Makes Ext.grid.column.Date use locale-aware default date format
 * 
 */
Ext.define( 'extAdmin.ExtUtilFormatTuning', {
	override : 'Ext.util.Format',
	
	constructor : function( cfg )
	{
		Ext.applyIf( cfg, {
			format : Ext.Date.defaultFormat
		});
		
		this.callOverridden( arguments );
	}
});