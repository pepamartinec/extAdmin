/**
 * Grid column with automatic currency formating
 * 
 */
Ext.define( 'extAdmin.widget.grid.column.Currency',
{
	extend : 'Ext.grid.column.Column',
	
	alias : 'widget.currencycolumn',
	
	align : 'right',
	
	currencySymbol : null,
	
	construct : function( config )
	{
		Ext.applyIf( config, {
			currencySymbol : extAdmin.defaultCurrency.symbol
		});
		
		this.callParent( arguments );
	},

	renderer : function( value )
	{		
		return Ext.util.Format.currency( value, this.currencySymbol );
	}
});
 