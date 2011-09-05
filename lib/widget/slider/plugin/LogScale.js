Ext.define( 'extAdmin.widget.slider.plugin.LogScale',
{
	init : function( slider )
	{
		slider.getRatio       = this.getRatio;
		slider.translateValue = this.translateValue;
		slider.reverseValue   = this.reverseValue;
	},
	
	getRatio : function()
	{
		var w = this.innerEl.getWidth(),
		    v = this.maxValue - this.minValue;
		
		return v === 0 ? w : (w/v)*(this.maxValue/Math.log(this.maxValue));		
	},
	
	translateValue : function( value )
	{
		var ratio = this.getRatio();		
		return Math.log( value - this.minValue ) * ratio - this.halfThumb;
	},
	
	reverseValue : function( pos )
	{
		var ratio = this.getRatio();		
		return Math.exp( pos / ratio ) + this.minValue;
	}
});