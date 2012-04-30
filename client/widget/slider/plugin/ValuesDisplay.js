Ext.define( 'extAdmin.widget.slider.plugin.ValuesDisplay',
{
	requires : [
		'Ext.Editor'
	],
	
	tpl : [
		'<ul class="slider-values-display">',
			'<li class="first" style="width: {borderWidth}%;">{firstValue}</li>',
			'<tpl for="values">',
				'<li style="width: {parent.innerWidth}%;">{.}</li>',
			'</tpl>',
			'<li class="last" style="width: {borderWidth}%;">{lastValue}</li>',
		'</ul>'
	],
	
	editable : false,
	
	constructor : function( config )
	{
		config = config || {};
		
		Ext.apply( this, {
			editable : config.editable || this.editable,
			tpl      : Ext.create( 'Ext.XTemplate', this.tpl )
		});
	},
	
    init : function( slider )
    {
    	var me = this;
    	
    	me.slider = slider;
    	
    	slider.on( 'render', me.render, me );
    },
	
	render : function()
	{
		var me = this;
		
		var values = me.slider.getValues();
		me.tpl.append( me.slider.bodyEl, {
			firstValue  : values.shift(),
			lastValue   : values.pop(),
			values      : values,
			borderWidth : 50  / ( values.length + 1 ),
			innerWidth  : 100 / ( values.length + 1 )
		});
		
		var displays = me.slider.bodyEl.query('.slider-values-display li');
		
		me.slider.on( 'change', function( slider, value, thumb ) {
			Ext.get( displays[ thumb.index ] ).update( ''+ value );
		});
		
		var display;
		for( var i = 0, dl = displays.length; i < dl; ++i ) {
			display = Ext.get( displays[ i ] );
			display.unselectable();
		}
		
		if( me.editable ) {			
			var editor = Ext.create( 'Ext.Editor', {
				autoSize : true,
				field: {
			        xtype : 'textfield',
			        grow  : true
			    },

				listeners : {
					complete : function( editor, value ) {
						var display = editor.boundEl;
						
						me.slider.setValue( display.thumb.index, value, true );
					}
				}
			});
			
			var onClick = function( event, display ) {
				editor.cancelEdit();
				editor.startEdit( display );
				editor.field.focus( true, true );
			};
			
			var display;
			for( var i = 0, dl = displays.length; i < dl; ++i ) {
				display = Ext.get( displays[ i ] );
				display.thumb = me.slider.thumbs[ i ];
				display.addCls( 'editable' );
				display.on( 'click', onClick );
			}
		}
	}
});