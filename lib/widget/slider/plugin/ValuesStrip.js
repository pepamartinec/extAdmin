Ext.define( 'extAdmin.widget.slider.plugin.ValuesStrip',
{	
	tpl : [
		'<ul class="slider-values-strip">',
			'<li class="first" style="width: {borderWidth}%;">{firstValue}</li>',
			'<tpl for="values">',
				'<li style="width: {parent.innerWidth}%;">{.}</li>',
			'</tpl>',
			'<li class="last" style="width: {borderWidth}%;">{lastValue}</li>',
		'</ul>'
	],
	
	constructor : function( config )
	{
		Ext.apply( this, {
			values : config.values,
			tpl    : Ext.create( 'Ext.XTemplate', this.tpl )
		});
	},
	
    init : function( slider )
    {
    	var me = this;
    	
    	me.slider = slider;
    	
    	slider.on( 'render', me.onRender, me );
    },
	
	onRender : function()
	{
		var me = this;
		
		me.tpl.append( me.slider.bodyEl, {
			firstValue : me.values.shift(),
			lastValue  : me.values.pop(),
			values     : me.values,
			borderWidth : 50  / ( me.values.length + 1 ),
			innerWidth  : 100 / ( me.values.length + 1 )
		});
	}
});