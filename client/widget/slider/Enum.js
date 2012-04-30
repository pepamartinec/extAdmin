Ext.define( 'extAdmin.widget.slider.Enum',
{
	extend : 'Ext.slider.Multi',
	
	availableValues : null,
	displayValues : null,
	
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
			decimalPrecision : 0,
			increment : 1,
			minValue  : 0,
			maxValue  : me.availableValues.length - 1
		});
		
		if( me.displayValues ) {
			me.values = [];
			
			for( var i = 0, dl = me.displayValues.length; i < dl; ++i ) {
				var idx = me.availableValues.indexOf( me.displayValues[ i ] );
				
				if( idx != -1 ) {
					me.values.push( idx );
				}
			}
		}
		
		me.callParent();
	},
	
	setDisplayValue : function( index, value, animate, changeComplete )
	{
		var me = this,
		    valueIdx = me.availableValues.indexOf( value );
		
		if( value != -1 ) {
			return me.callParent([ index, valueIdx, animate, changeComplete ]);
			
		} else {
			return;
		}
	},
	
	getDisplayValue : function( index )
	{
		var me = this,
		    valueIdx = me.callParent( arguments );
		
		return me.availableValues[ valueIdx ];
	}
});