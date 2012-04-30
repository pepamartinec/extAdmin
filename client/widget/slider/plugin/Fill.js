Ext.define( 'extAdmin.widget.slider.plugin.Fill',
{
	lowerThumb : null,
	
	higherThumb : null,
	
	leftPos  : null,
	rightPos : null,
	
	constructor : function( config )
	{
		Ext.apply( this, {
			lowerThumb  : config.lowerThumb,
			higherThumb : config.higherThumb
		});
	},
	
    init : function( slider )
    {
    	var me = this;
    	
    	me.slider = slider;
    	
    	slider.onRender = Ext.Function.createSequence( slider.onRender, me.onRender, me );
    },
    
	onRender : function()
	{
		var me = this;
		
		// create fill over whole slider
		me.fill = me.slider.inputEl.insertFirst( {
			cls: 'x-slider-bg'
		});
		
		me.fill.insertHtml( 'afterBegin', '&nbsp;' );
		me.fill.setLeft( 0 );
		me.fill.setRight( 0 );
		
		// setup position updaters
    	if( Ext.isNumber( me.lowerThumb ) ) {
    		var thumb      = me.slider.thumbs[ me.lowerThumb ],
		        leftOffset = parseInt( me.slider.inputEl.getStyle('margin-left') ) + thumb.el.getWidth();
    		
    		thumb.move = Ext.Function.createSequence( thumb.move, function( v ) {
    			me.fill.setLeft( v + leftOffset );
    		} );
    		
    	} else {
    		me.fill.addCls('fixed-left');
    	}
    	
    	if( Ext.isNumber( me.higherThumb ) ) {
    		var thumb       = me.slider.thumbs[ me.higherThumb ],
		        rightOffset = thumb.el.getWidth();
    		
    		thumb.move = Ext.Function.createSequence( thumb.move, function( v ) {
    			me.fill.setRight( me.slider.inputEl.getWidth() - ( v + rightOffset ) );
    		} );
    		
    	} else {
    		me.fill.addCls('fixed-left');
    	}
	}
});