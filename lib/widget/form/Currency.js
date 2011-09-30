Ext.define( 'extAdmin.widget.form.Currency',
{
	extend : 'Ext.form.field.Number',
	alias  : 'widget.currencyfield',
	
	currencySymbol : null,
	
	initComponent : function()
	{
		Ext.Object.merge( this, {
			fieldStyle : {
				'text-align' : 'right'
			}
		});
		
		Ext.applyIf( this, {
			currencySymbol : extAdmin.currencies[ extAdmin.defaultCurrency ].symbol
		});
		
		this.callParent( arguments );
	},
	
	valueToRaw : function( value )
	{
		return Ext.util.Format.currency( value, this.currencySymbol );
	},
	
	rawToValue : function( rawValue )
	{
		return parseFloat( rawValue.replace( new RegExp('[^\\d\\' + Ext.util.Format.decimalSeparator + ']', 'g' ), '' ) );
	},
	
	getErrors : function( value )
	{
		value = this.rawToValue( value );
		this.callParent( arguments );
	}
});