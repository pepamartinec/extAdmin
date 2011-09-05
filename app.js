Ext.namespace( 'extAdmin' );

Ext.require([
	'extAdmin.App',
	'extAdmin.ModuleManager',
	'extAdmin.AuthManager',
	'extAdmin.ErrorHandler'
]);

Ext.apply( extAdmin,
{
	/**
	 * App base href
	 * 
	 */
	baseHref : null,
	
	/**
	 * AJAX requests responder
	 * 
	 */
	serverHandle : null,
	
	/**
	 * Available localizations
	 * 
	 */
	localizations : [ 'cs' ],
	
	/**
	 * Interface language
	 * 
	 */
	lang : 'cs',
	
	/**
	 * Debug flag
	 * 
	 */
	debug : false,
	
	init : function( config )
	{
		Ext.apply( this, config );
		
		// init Ext.form.field.Date to accept MySQL date(time) format
		Ext.form.field.Date.prototype.altFormats   = 'Y-m-d H:i:s|'+ Ext.form.field.Date.prototype.altFormats;
		Ext.form.field.Date.prototype.submitFormat = 'Y-m-d';
		
		// implement Ext.Component.upDelayed()
		Ext.Component.implement({
			upDelayed : function( selector, cb, cbScope ) {
				var result = this;

				while( result.ownerCt ) {
					result = result.ownerCt;
					
					if( selector == null || Ext.ComponentQuery.is( result, selector ) ) {
						Ext.callback( cb, cbScope, [ result ] );
						return;
					}
				}
				
				result.on({
					single : true,
					scope  : this,
					
					added : function() {
						result.upDelayed( selector, cb, cbScope );
					}
				});
			}
		});
		
		// setup error handling
		extAdmin.ErrorHandler.setDebug( this.debug );
		
		extAdmin.AuthManager.init( config.authManager );
		extAdmin.AuthManager.refreshCurrentUser();
	},
	
	launch : function( config )
	{
		return Ext.create( 'extAdmin.App', config );
	},
	
	localization : function( lang, labels )
	{
		this.lang = lang;
		
		Ext.onReady( function() {
			var cls;
			
			for( var clsName in labels ) {
				cls = Ext.ClassManager.get( clsName );
				
				if( cls ) {
					cls.prototype.texts = labels[ clsName ];
					
				} else {
					console.warn( "[extAdmin.localization] Dynamically loading class '"+ clsName +"'" );
					
					Ext.require( clsName, function() {
						cls = Ext.ClassManager.get( clsName );
						
						if( cls ) {
							cls.prototype.texts = labels[ clsName ];
							
						} else {
							console.warn( "[extAdmin.localization] Localization for missing class '"+ clsName +"'" );
						}
					});
				}
			}
		});
	}
});
