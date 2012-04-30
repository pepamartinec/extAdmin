/**
 * Adds space between value and currency symbol.
 * 
 */
Ext.define( 'extAdmin.ExtUtilFormatTuning', {
	override : 'Ext.util.Format',
	
	currency : function(v, currencySign, decimals, end)
	{
		var negativeSign = '',
		    format = ",0",
		    i = 0;
		    v = v - 0;
		if (v < 0) {
			v = -v;
			negativeSign = '- ';
		}
		decimals = decimals || UtilFormat.currencyPrecision;
		format += format + (decimals > 0 ? '.' : '');
		for (; i < decimals; i++) {
			format += '0';
		}
		v = UtilFormat.number(v, format);
		if ((end || UtilFormat.currencyAtEnd) === true) {
			return Ext.String.format("{0}{1} {2}", negativeSign, v, currencySign || UtilFormat.currencySign);
		} else {
			return Ext.String.format("{0}{1} {2}", negativeSign, currencySign || UtilFormat.currencySign, v);
		}
	}
});