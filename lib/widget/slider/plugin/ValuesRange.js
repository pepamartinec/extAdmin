Ext.define( 'extAdmin.widget.slider.plugin.ValuesRange',
{
	tpl : [
		'<ul class="slider-values-range">',
			'<li class="min"></li>',
			'<li class="max"></li>',
		'</ul>'
	],
	
	init : function( slider )
	{
		var me = this;
		
		slider.fieldSubTpl = me.tpl.concat( slider.fieldSubTpl );
		
		me.slider = slider;
		
		slider.on( 'render', me.onRender, me );
	},
	
	onRender : function()
	{
		var me = this;
		
		me.min = me.slider.bodyEl.down('.slider-values-range .min'),
	    me.max = me.slider.bodyEl.down('.slider-values-range .max');
		
		me.slider.on( 'change', me.update, me );
		me.update();
	},
	
	update : function()
	{
		var me = this;
		
		me.min.update( me.slider.minValue );
		me.max.update( me.slider.maxValue );
	}
});
