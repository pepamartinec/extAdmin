Ext.namespace( 'extAdmin' );

Ext.require([
	'extAdmin.action.ActionManager'
]);
	

//
//Ext.require([
//	// singleton handlers & managers
//	'extAdmin.ErrorHandler',
//	
//	// system components
//	'extAdmin.component.Viewport',
//	'extAdmin.component.dataBrowser.DataBrowser',
//	'extAdmin.component.dataBrowser.dataList.Tree',
//	'extAdmin.component.dataBrowser.dataList.Grid',
//	'extAdmin.component.dataBrowser.dataList.TreeGrid',
//	'extAdmin.component.form.Form',
//	'extAdmin.component.GalleryBrowser',
//	
//	'extAdmin.widget.grid.column.FullTree',
//	'extAdmin.widget.grid.column.Localizations',
//	'extAdmin.widget.grid.column.Currency',
//	
//	// form widgets
//	'extAdmin.widget.form.Image',
//	'extAdmin.widget.form.ForeingRecord',
//	'extAdmin.widget.form.Position',
//	'extAdmin.widget.form.Currency',
//	'extAdmin.widget.form.UrlName',
//	'extAdmin.widget.form.gridList.GridList',
//	'extAdmin.widget.form.FilesGridList',
//	'extAdmin.widget.form.tinyMce.TinyMce',
//	'extAdmin.widget.form.HorizontalContainer'
//]);

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
	
	currencies : {
		CZK : { symbol : '\u004b\u010d' },
		EUR : { symbol : '\u20ac' },
		USD : { symbol : '\u0024' }
	},
	
	defaultCurrency : 'CZK',
	
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
		
		this.initTweaks();
		
		// setup error handling
		extAdmin.ErrorHandler.setDebug( this.debug );
		
//		extAdmin.AuthManager.init( config.authManager );
//		extAdmin.AuthManager.refreshCurrentUser();
	},
	
	createEnv : function( config, cb )
	{
		var env = Ext.create( 'extAdmin.Environment' );
		evn.init( config, cb );
	},
	
	launch : function(  )
	{
		
	},
	
	initTweaks : function()
	{
		// make URL parameters encoding PHP compatible
		var original = Ext.Object.toQueryString;
		Ext.Object.toQueryString = function( object ) {
			return original( object, true );
		};
		
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
		
		// add space between value and currency symbol
		var UtilFormat = Ext.util.Format;
		UtilFormat.currency = function(v, currencySign, decimals, end) {
			var negativeSign = '',
			    format = ",0",
			    i = 0;
			    v = v - 0;
			if (v < 0) {
				v = -v;
				negativeSign = '- ';
			}
			decimals = decimals || UtilFormat.currencyPrecision;
			format += format + (decimals > 0 ? '.' : '');
			for (; i < decimals; i++) {
				format += '0';
			}
			v = UtilFormat.number(v, format);
			if ((end || UtilFormat.currencyAtEnd) === true) {
				return Ext.String.format("{0}{1} {2}", negativeSign, v, currencySign || UtilFormat.currencySign);
			} else {
				return Ext.String.format("{0}{1} {2}", negativeSign, currencySign || UtilFormat.currencySign, v);
			}
		};

		// make DateColumn use locale-aware defaul date format
		Ext.grid.column.Date.override({
			constructor : function( cfg ) {
			
				Ext.applyIf( cfg, {
					format : Ext.Date.defaultFormat
				});
				
				this.callOverridden( arguments );
			}
		});		
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
	},
	
	applyConfig : function( object, config )
	{
		if( object && config ) {
			for( var property in config ) {
				if( config[property] !== undefined ) {
					object[property] = config[property];
				}
			}
		}

        return object;
	},
	
	applyConfigIf : function( object, config )
	{
		if( object && config ) {
			for( var property in config ) {
				if( object[property] === undefined && config[property] !== undefined ) {
					object[property] = config[property];
				}
			}
		}

        return object;
	},
	
    abstractFn : function()
    {
    	Ext.Error.raise({
    		msg: 'Not implemented abstract method called',
    		'this' : this
    	});
    },
    
    callback : function( cb, args )
    {
    	if( cb === null || cb === undefined ) {
    		return true;
    	}
    	
    	if( Ext.isFunction( cb ) ) {
    		return cb.apply( null, args );
    		
    	}
    	
    	if( Ext.isArray( cb ) ) {
    		if( cb.length == 1 ) {
    			return cb[0].apply( null, args );
    			
    		} else if( cb.length == 2 ) {
    			return cb[0].apply( cb[1], args );
    		}
    	};
    	
    	// FIXME supply some cool exception here
    	Ext.Error.raise('Invalid callback');
    }
});
