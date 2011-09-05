Ext.define( 'extAdmin.widget.tab.plugin.Buttons',
{
	init : function( tabPanel )
	{
		var me = this;
		
		me.tabPanel = tabPanel;
		
		tabPanel.on({
			single : true,
			render : function() {
				me.tabBar = tabPanel.tabBar;
				
				var renderTpl = me.tabBar.renderTpl,		
				    strip = renderTpl.pop();
				
				renderTpl.push( '<div class="{baseCls}-buttons">:)</div>' );
				renderTpl.push( strip );
			}
		});
	}
});