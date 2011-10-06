/**
 * Currency form field
 * 
 */
Ext.define( 'extAdmin.widget.form.Currency',
{
	extend : 'Ext.form.field.Number',
	alias  : 'widget.currencyfield',
	
	/**
	 * Currency symbol displayed inside field with value.
	 * 
	 * Defaults to current locale currency symbol
	 * 
	 * @cfg {String} currencySymbol
	 */
	currencySymbol : undefined,
	
	/**
	 * Decimal separator
	 * 
	 * Defaults to current locale symbol
	 * 
	 * @cfg {String} decimalSeparator
	 */
	decimalSeparator : undefined,
	
	/**
	 * Field initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		Ext.Object.merge( this, {
			fieldStyle : {
				'text-align' : 'right'
			}
		});
		
		Ext.applyIf( this, {
			decimalSeparator : Ext.util.Format.decimalSeparator,
			currencySymbol   : extAdmin.currencies[ extAdmin.defaultCurrency ].symbol
		});
		
		this.callParent( arguments );
	},
	
	/**
	 * Conversion from float value to text representation
	 * 
	 * @param   {Float} value
	 * @returns {String}
	 */
	valueToRaw : function( value )
	{
		return Ext.util.Format.currency( value || 0, this.currencySymbol );
	},
	
	/**
	 * Conversion from text representation to float value
	 * 
	 * @param   {String} rawValue
	 * @returns {Float}
	 */
	rawToValue : function( rawValue )
	{
		return this.parseValue( rawValue );
	},
	
	/**
	 * Parses supplied text value
	 * 
	 * @param   {String} value
	 * @returns {Float}
	 */
	parseValue : function( value )
	{
		return this.callParent([ value.replace( new RegExp('[^\\d\\' + this.decimalSeparator + ']', 'g' ), '' ) ]);
	},
	
	/**
	 * Returns active field errors
	 * 
	 * @param   {Float} value
	 * @returns
	 */
	getErrors : function( value )
	{
		value = this.rawToValue( value );
		
		return this.callParent( arguments );
	}
});