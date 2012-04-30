Ext.define( 'extAdmin.widget.container.Viewport',
{
	extend   : 'Ext.container.Container',
	requires : [
		'Ext.EventManager'
	],
	
	isViewport : true,
	ariaRole   : 'application',
	
	autoScroll : true,
	
	initComponent : function()
	{
		var me = this,
		    html = Ext.fly(document.body.parentNode);
		
		me.callParent( arguments );
		
		html.addCls( Ext.baseCSSPrefix + 'viewport' );
		if( me.autoScroll ) {
			html.setStyle('overflow', 'auto');
		}
		
		if( me.renderTo ) {
			me.el = Ext.get( me.renderTo );
			
			me.width  = me.el.getWidth();
			me.height = me.computeHeight();
			
			me.el.on( 'resize', function() { me.setSize( me.el.getWidth(), me.computeHeight() ); } );
			Ext.EventManager.onWindowResize( function() { me.setSize( me.el.getWidth(), me.computeHeight() ); } );
			
		} else {
			me.el = Ext.getBody();
			
			me.width  = Ext.core.Element.getViewportWidth();
			me.height = Ext.core.Element.getViewportHeight();
			
			Ext.EventManager.onWindowResize( function( w, h ) { me.setSize( w, h ); } );
		}
		
		me.el.dom.scroll = 'no';
		
		me.allowDomMove = false;
		me.renderTo     = me.el;
	},
	
	computeHeight : function()
	{
		var me = this;
		
		var el       = me.el.dom,
		    parent   = el.parentNode,
		    siblings = parent.childNodes;
		
		var sHeight = 0;
		for( var i = 0, sl = siblings.length; i < sl; ++i ) {
			if( siblings[ i ] != el && siblings[ i ].clientHeight ) {
				sHeight += siblings[ i ].scrollHeight;
			}
		}
		
		return Ext.getBody().getHeight() - sHeight - parseInt( me.el.getStyle('margin-top') ) - parseInt( me.el.getStyle('margin-bottom') );
	}
});

