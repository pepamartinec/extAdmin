Ext.define( 'extAdmin.component.Form',
{
	extend : 'Ext.form.Panel',
	
	requires : [
		'extAdmin.ModuleManager',
		'Ext.Error'
	],
	
	texts : {
		loadingData : 'Načítám data',
		savingData  : 'Ukládám data',
		confirmBtn  : 'Uložit',
		cancelBtn   : 'Storno',
		
		dirtyWarn : {
			title : 'Varování',
			message : 'Formulář obsahuje neuložené změny. Pokud budete pokračovat, tyto změny budou zahozeny.<br />Přejete si pokračovat?'
		},
		
		submitFailure : {
			title : 'Chyba při ukládání'
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
	
	/**
	 * Component contructor
	 * 
	 * @constructor
	 */
	constructor : function()
	{
		var me = this,
		    moduleName = me.$className.match( /\.([\w]+)\.[\w]+$/ )[1],
		    formName   = me.$className.match( /\.([\w]+)$/ )[1];
		
		me.module   = extAdmin.ModuleManager.get( moduleName );
		me.formName = formName;
		
		me.callParent();
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
			}
		});
		
		me.addEvents( 'beforeload', 'load', 'beforesubmit', 'submit' );
		
		me.callParent();
		
		var baseForm = me.getForm();
		
		// configure baseForm
		Ext.apply( baseForm, {
			trackResetOnLoad : true,
			url : me.module.buildUrl({
				request : 'form',
				name    : me.formName,
				action  : 'submit'					
			})
		});
		
		// inject own load/save handlers
		baseForm.on({
			beforeaction : function( form, action ) {			
				switch( action.type ) {
					case 'load':
						action.onSuccess = function( response ) {
							var result = this.processResponse( response ),
							    form   = this.form;
							
							me.onFormLoad( result );
							
							if( result === true || result.success == false || result.data == null ) {
								this.failureType = Ext.form.action.Action.LOAD_FAILURE;
								form.afterAction( this, false );
								return;
							}
							
							form.clearInvalid();
							form.setValues( result.data );
							form.afterAction( this, true );
						};
						
						return me.beforeFormLoad();
						break;
						
					case 'submit':
						action.onSuccess = function( response ) {
				        	var result  = this.processResponse( response ),
							    form    = this.form,
							    success = true;
						
							me.onFormSubmit( action, result );
							
							if( result !== true && !result.success ) {
					            if( result.errors ) {
					                form.markInvalid( result.errors );
					            }
					            
					            this.failureType = Ext.form.action.Action.SERVER_INVALID;
					            success = false;
							}
							
							form.afterAction( this, success );
						};
						
						return me.beforeFormSubmit();
						break;
					
					default:
						Ext.Error.raise("Unexpected action type '"+ action.type +"' received");
						return false;
				}
			},
			
			actionfailed : function( form, action )
			{
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
			}
		});
		
		if( me.submitOnEnter ) {
			me.initKeyboardSubmit();
		}
	},
	
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
	 * Form pre-load handler
	 * 
	 * @private
	 */
	beforeFormLoad : function()
	{
		var me = this;
		
		if( me.fireEvent( 'beforeload', [ me ] ) === false ) {			
			return false;
		}
		
		return true;
	},
	
	/**
	 * Form post-load handler
	 * 
	 * @private
	 * @param {Object} response
	 */
	onFormLoad : function( response )
	{
		var me = this;
		
		// apply returned conf
		if( response.formConf ) {
			me.configureForm( response.formConf );
		}
		
		me.fireEvent( 'load', [ me, response ] );
	},
	
	/**
	 * TODO
	 * @param conf
	 */
	configureForm : function( conf )
	{
		return;
		
		var visible = this.isVisible();
		this.setVisible( false );
		
		var form = this.formPanel.getForm();
		
		// apply global conf to whole form
		this.submitBtn.setDisabled( conf.readonly );
		
		for( var i = 0, il = form.items.items.length; i < il; ++i ) {
			var item = form.items.items[i],
			    name = item.name;
			
			// apply global (default) conf to item
			item.setReadOnly( !!conf.readonly );
			
			// apply item-specific conf
			if( conf.items[ name ] ) {
				for( var prop in conf.items[ name ] ) {
					var value = conf.items[ name ][ prop ];
					
					switch( prop ) {
						case 'disabled': value ? item.hide() : item.show(); break;
						case 'readonly': item.setReadOnly( value ); break;
					}
				}
			}						
		}
		
		this.setVisible( visible );
	},
	
	/**
	 * Form pre-submit handler
	 * 
	 * @private
	 */
	beforeFormSubmit : function()
	{
		var me = this;
		
		if( me.fireEvent( 'beforesubmit', [ me ] ) === false ) {			
			return false;
		}
		
		return true;
	},
	
	/**
	 * Form post-submit handler
	 * 
	 * @private
	 * @param {Object} response
	 */
	onFormSubmit : function( action, response )
	{
		var me = this;
		
		if( response.success ) {
			if( response.data == null ) {
				console.warn( "["+me.$className+"] Missing data in form submition response at module '"+ me.module.name +"', form '"+ me.formName +"'" );
				return;
			}
			
			var data = response.data,
			    fields = me.getForm().getFields();
			
			fields.each( function( field ) {
				var value = data[ field.name ];
				
				if( value === undefined ) {
					// <debug>
					console.warn( "["+me.$className+"] Missing data for field '"+ field.name +"' at module '"+ me.module.name +"', form '"+ me.formName +"'" );
					// </debug>
					
					value = null;
				}
				
				field.setValue( value );
				field.resetOriginalValue();
			});
			
			me.fireEvent( 'submit', [ me, response ] );
		}
	},
	
	/**
	 * Load form data
	 * 
	 * @param {Object} options
	 */
	load : function( options )
	{
		var me = this;
		
		options = Ext.applyIf( options || {}, {
			url : me.module.buildUrl({
				request : 'form',
				name    : me.formName,
				action  : 'load'+ inspirio.String.ucfirst( options.type || 'record' ) +'Data'					
			}),
			
			waitMsg : me.texts.loadingData
		});
		delete options.type;
		
		me.callParent([ options ]);
	},
	
	/**
	 * Submits form data
	 * 
	 * @param {Object} options
	 */
	submit : function( options )
	{
		var me = this;
		
		if( me.getForm().isDirty() == false ) {
			return;
		}
		
		options = Ext.applyIf( options || {}, {
			url : me.module.buildUrl({
				request : 'form',
				name    : me.formName,
				action  : 'submit'					
			}),
			
			waitMsg : me.texts.savingDatam,
			
			userSubmit : true
		});
		
		me.callParent([ options ]);
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
		
		if( me.getForm().isDirty() ) {
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