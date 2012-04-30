Ext.define( 'extAdmin.component.dataBrowser.Filters',
{	
	/**
	 * Local values storage
	 * 
	 * @protected
	 * @property {Object}
	 */
	values : null,
	
	/**
	 * Bound filters form
	 * 
	 * @protected
	 * @property {Ext.form.Basic}
	 */
	form : null,
	
	/**
	 * Constructor
	 * 
	 * @constructor
	 * @public
	 */
	constructor : function( config )
	{
		var me = this;
		
		config = config || {};
		
		me.values = config.values || {};
	},
	
	/**
	 * Binds given form
	 * 
	 * @param {Ext.form.Basic} form
	 */
	bindForm : function( form )
	{
		var me = this;
		
		me.form = form;
	},
	
	/**
	 * Sets single filter value
	 * 
	 * Null value clears the filter
	 * 
	 * @param {String} property
	 * @param {Mixed}  value
	 */
	setValue : function( property, value )
	{
		var me = this;
		
		if( me.form ) {
			var field = me.form.findField( property );
			
			if( field ) {
				field.setValue( value );
				value = field.getValue();
			}
		}
		
		if( value === null ) {
			delete me.values[ property ];
			
		} else {
			me.values[ property ] = value;
		}
	},
	
	/**
	 * Returns single filter value
	 * 
	 * @param   {String} property
	 * @returns {Mixed}
	 */
	getValue : function( property )
	{
		return this.values[ property ];
	},
	
	/**
	 * Filters values setter
	 * 
	 * @param {Object} values
	 */
	setValues : function( values )
	{
		var me = this;
		
		for( var prop in values ) {
			me.setValue( prop, values[ prop ] );
		}
	},
	
	/**
	 * Filters values getter
	 * 
	 * @returns {Object}
	 */
	getValues : function()
	{
		return this.form ?
				Ext.apply( Ext.apply( {}, this.form.getValues() ), this.values ) :
				Ext.apply( {}, this.values );
	}
});