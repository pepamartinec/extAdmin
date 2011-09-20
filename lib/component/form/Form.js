Ext.define( 'extAdmin.component.form.Form',
{
	extend : 'Ext.form.Panel',
	
	requires : [
		'extAdmin.ModuleManager'
	],
	
	uses : [
		'extAdmin.component.form.backend.Basic',
		'extAdmin.component.form.backend.Localizable'
	],
	
	texts : {
		confirmBtn  : 'Uložit',
		cancelBtn   : 'Storno',
		
		dirtyWarn : {
			title : 'Varování',
			message : 'Formulář obsahuje neuložené změny. Pokud budete pokračovat, tyto změny budou zahozeny.<br />Přejete si pokračovat?'
		},
		
		submitFailure : {
			title : 'Chyba při ukládání'
		},
		
		langs : {
			cs : 'Česky',
			en : 'Anglicky',
			de : 'Německy'
		}
	},
	
	/**
	 * Indicates, whether form should be automatically submitted on enter keypress
	 * 
	 * @cfg {Boolean} submitOnEnter
	 */
	submitOnEnter : true,
	
	/**
	 * Context module
	 * 
	 * @property {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * Form class name
	 * 
	 * @property {String} formName
	 */
	formName : null,
	
	isLocalizable : false,
	activeLocalization : 'cs',
	
	/**
	 * Component contructor
	 * 
	 * @constructor
	 */
	constructor : function( config )
	{
		var me = this,
		    moduleName = me.$className.match( /\.([\w]+)\.[\w]+$/ )[1],
		    formName   = me.$className.match( /\.([\w]+)$/ )[1];
		
		me.module   = extAdmin.ModuleManager.get( moduleName );
		me.formName = formName;
		
		me.callParent( arguments );
	},
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		// configure form
		Ext.applyIf( me, {
			width   : 700,
			iconCls : 'i-form-edit',
			fieldDefaults : {
				anchor    : '100%',
				msgTarget : 'side'
			},
			
			backend : {
				xtype  : 'basic',
				module : me.module
			},
			
			dockedItems : []
		});
		
		if( me.isLocalizable ) {
			me.initLocalizable();
		}
		
		me.callParent( arguments );
		me.originalTitle        = me.title;
		me.localizationsToolbar = me.getComponent( 'localizationsToolbar' );
		
		me.form.on({
			dirtychange : function( form, dirty ) {
				me.setTitle( ( dirty ? '* ' : '' ) + me.originalTitle );
			}
		});
		
		if( me.submitOnEnter ) {
			me.initKeyboardSubmit();
		}
	},
	
	
	/**
	 * Initializes localizable feature
	 * 
	 * @private
	 * @return {Object}
	 */
	initLocalizable : function()
	{
		var me = this,
		    localizations = extAdmin.localizations;
		
		Ext.Object.merge( me.backend, {
			xtype     : 'localizable',
			listeners : {
				'switch'     : function() { me.updateFlags(); },
				'datachange' : function() { me.updateFlags(); }
			}
		});
		
		if( localizations.length < 2 ) {
			return null;
		}
		
		var tbItems = [
			'->',
			{ xtype : 'component', html : 'Jazyk:' },
			{ xtype : 'tbspacer', width : 10 }
		];
		
		for( var lang, i = 0, ll = localizations.length; i < ll; ++i ) {
			lang = localizations[ i ];
			
			tbItems.push({
				text        : me.texts.langs[ lang ],
				iconCls     : 'langIcon inactive missing '+ lang,
				pressed     : lang == me.activeLocalization,
				lang        : lang,
				listeners   : {
					click : function() {
						var localLang = lang;
						return function() { me.form.switchLocalization( localLang ); };
					}()
				}
			});
		};
		
		me.dockedItems.push({
			xtype  : 'toolbar',
			itemId : 'localizationsToolbar',
			dock   : 'top',
			cls    : 'localizationsToolbar',
			items  : tbItems
		});
	},
	
	/**
	 * Creates form backend
	 * 
	 * @private
	 * @return {Ext.form.Basic}
	 */
	createForm : function()
	{
		var me = this;
		
		Ext.applyIf( me.backend, me.initialConfig );
		
		var be = Ext.createByAlias( 'formbackend.'+ me.backend.xtype, me, me.backend );
		
		be.on( 'actionfailed', function( form, action ) {
			var actionProto = Ext.form.action.Action;
			
			switch( action.failureType ) {
				// form validation
				case actionProto.CLIENT_INVALID:
					// nothing
					break;
				
				// server validation
				case actionProto.SERVER_INVALID:
					if( action.result.message ) {
						extAdmin.ErrorHandler.fireRecoverable({
							text : action.result.message
						});
					}
					break;
				
				// server connection
				case actionProto.CONNECT_FAILURE:
				case actionProto.LOAD_FAILURE:
					extAdmin.ErrorHandler.handleFormActionFailure( action );
					break;
			}
		});
		
		return be;
	},
	
	/**
	 * Initializes keyboard submit
	 * 
	 * @private
	 */
	initKeyboardSubmit : function()
	{
		var me = this,
		    fields = me.getForm().getFields(),
		    handler = function( field, e ) {
				if( e.getKey() == e.ENTER ) {
					me.submit();
				}
			};
		
		fields.each( function( field ) {
			field.on( 'specialkey', handler );
		});
	},
	
	/**
	 * Adds form tab
	 * 
	 * @param config
	 */
	addTab : function( config )
	{
		var me = this;
		
		if( me.tabsPanel == null ) {			
			me.tabsPanel = {
				xtype       : 'tabpanel',
				bodyPadding : 5,
				defaults    : {
					msgTarget : 'side'
				},
				items       : []
			};
			
			if( me.items == null ) {
				me.items = [];
			}
			
			me.items.push( me.tabsPanel );
		}
		
		Ext.applyIf( config, {
			layout : 'anchor'
		});
		
		me.tabsPanel.items.push( config );
	},
	
	/**
	 * Updates flags state according to given object available localizations
	 * 
	 * @private
	 * @param dataObject
	 */
	updateFlags : function()
	{
		var me = this;
		
		// setup flags
		var barItems = me.localizationsToolbar.items.items,
		    actLoc = me.form.getActiveLocalization(),
		    flag, clsName, isActive;
		
		for( var i = 0, fl = barItems.length; i < fl; ++i ) {
			flag = barItems[ i ];
			
			// not a flag
			if( flag.type != 'button' || /langIcon/.test( flag.iconCls ) == false ) {
				continue;
			}
			
			// get current flag state
			clsName = flag.btnIconEl ? flag.btnIconEl.dom.className : flag.iconCls;
			
			// determine new flag state
			if( flag.lang ) {				
				// active/inactive
				isActive = flag.lang == actLoc;
				
				if( isActive ) {
					clsName = clsName.replace( /inactive/gi, 'active' );
				} else {
					clsName = clsName.replace( /(\s|^)active/gi, ' inactive' );
				}
				
				if( flag.rendered ) {
					flag.toggle( isActive );
				}
				
				// missing/present
				if( me.form.hasLocalization( flag.lang ) ) {
					clsName = clsName.replace( /missing/gi, 'present' );
				} else {
					clsName = clsName.replace( /present/gi, 'missing' );
				}
			}
			
			// apply new flag state
			if( flag.btnIconEl ) {
				flag.btnIconEl.dom.className = clsName;
			} else {
				flag.iconCls = clsName;
			}
		}
	},
	
	/**
	 * Checks whether form is dirty and fires warning popup
	 * 
	 * @param cb
	 * @param scope
	 */
	dirtyWarn : function( cb, scope )
	{
		var me = this;
		
		var df = me.getForm().isDirty();
		
		if( df ) {
		    me.getForm().getFields().findBy(function(f) {
	            if( f.isDirty() ) {
	    			var val = f.getValue(),
				    ori = f.originalValue;
	            }
	        });
			
			Ext.Msg.show({
				icon    : Ext.Msg.WARNING,
				title   : me.texts.dirtyWarn.title,
				msg     : me.texts.dirtyWarn.message,
				buttons : Ext.Msg.YESNO,
				fn      : function( btn ) {
					if( btn == 'yes' ) {
						Ext.callback( cb, scope );
					}
				}
			});
			
		} else {
			Ext.callback( cb, scope );
		}
	}
});