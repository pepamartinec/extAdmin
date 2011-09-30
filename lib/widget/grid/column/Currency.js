/**
 * Grid column with automatic currency formating
 * 
 */
Ext.define( 'extAdmin.widget.grid.column.Currency',
{
	extend : 'Ext.grid.column.Column',
	alias : 'widget.currencycolumn',
	
	align : 'right',
	
	/**
	 * Column constructor
	 * 
	 * @public
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		Ext.applyIf( config, {
			
			/**
			 * Displayed currency symbol (ignored when {@link symbolField} is set). When NULL,
			 * default application currency is used.
			 * 
			 *  @cfg {String,Null} currencySymbol
			 */
			currencySymbol : extAdmin.currencies[ extAdmin.defaultCurrency ].symbol,
			
			/**
			 * When supplied, given field is read and used as currencySymbol for every displayed record
			 * 
			 * @cfg {String,Null} currencyField
			 */
			currencyField : null
		});
		
		var symbols = {};
		for( var code in extAdmin.currencies ) {
			symbols[ code ] = extAdmin.currencies[ code ].symbol;
		}
		
		/**
		 * Cell renderer
		 * 
		 * @public
		 * @param value
		 * @param meta  
		 * @param record
		 * @returns {String}
		 */
		me.renderer = function( value, meta, record ) {
			var symbol = me.currencyField ?
			    	symbols[ record.get( me.currencyField ) ] :
			    	me.currencySymbol;
			
			return Ext.util.Format.currency( value, symbol );
		};
		
		me.callParent( arguments );
	}
});
 