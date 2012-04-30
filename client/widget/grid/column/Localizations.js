/**
 * Custom action-column implementation
 * 
 */
Ext.define( 'extAdmin.widget.grid.column.Localizations',
{
	extend : 'Ext.grid.column.Column',
	
	alias : 'widget.localizationscolumn',
	
	header    : '&nbsp;',
	altText   : '',
	iconWidth : 20,
	
	/**
	 * Constructor
	 * 
	 * @param {Object} config
	 */
	constructor: function( config )
	{
		var me = this,
		    localizations = extAdmin.localizations;
		
		Ext.apply( config, {
			sortable	 : false,
			groupable	 : false,
			menuDisabled : true,
			
			align        : 'center',
			flex         : false,
			width        : localizations.length * ( me.iconWidth + 2 ) + 10,
			
			renderer     : function( existingLocalizations, meta )
			{
				var icons = [],
					lang, cls;
				
				for( var i = 0, ll = localizations.length; i < ll; ++i ) {
					lang = localizations[ i ];
					cls  = 'langIcon '+ lang;
					
					if( existingLocalizations.indexOf( lang ) == -1 ) {
						cls += ' missing';
					}
					
					icons.push( '<span class="'+ cls +'" title="'+ lang +'">&nbsp;</span>' );
				}
				
				return icons.join('');
			}
		} );
		
		me.callParent( arguments );
	}
});
 