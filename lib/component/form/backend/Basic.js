Ext.define( 'extAdmin.component.form.backend.Basic',
{
	extend : 'Ext.form.BasicForm',
	alias  : 'formbackend.basic',
	
	requires : [
		'extAdmin.component.form.action.Load',
		'extAdmin.component.form.action.Submit'
	],
	
	texts : {
		loadingData : 'Načítám data',
		savingData  : 'Ukládám data'
	},
	
	/**
	 * Context module
	 * 
	 * @cfg {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * Action called to submit data
	 * 
	 * Defaults to 'submit'
	 * 
	 * FIXME temporary workaround, until form-specific
	 * requestes ({ request : form, name : ..., action ... })
	 * are cleared-out
	 * 
	 * @cfg {String} submitAction
	 */
	submitAction : null,
	
	/**
	 * Backend constructor
	 * 
	 * @public
	 * @constructor
	 */
	constructor : function( owner, config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		Ext.apply( me, {
			trackResetOnLoad : true,
			module           : owner.module,
			formName         : owner.formName
		});
	},
	
	/**
	 * Empties all form fields
	 * 
	 * @public
	 * @return {extAdmin.component.form.backend.Basic}
	 */
	clearValues : function()
	{
		var fields = this.getFields().items;
		
		for( var i = 0, fl = fields.length; i < fl; ++i ) {
			fields[ i ].setValue( null );
		}
		
		return this;
	},
	
	/**
	 * Load form data
	 * 
	 * @public
	 * @param {Object} options
	 */
	load : function( options )
	{
		var me = this;
		
		var module = extAdmin.ModuleManager.get( options.module ) || me.module;
		delete options.module;
		
		options = Ext.Object.merge({
			url : {
				request : 'form',
				name    : me.formName,
				action  : 'load'+ Ext.String.capitalize( options.type || 'record' ) +'Data'					
			},
				
			waitMsg : me.texts.loadingData
		}, options );
		delete options.type;
		
		// encode URL
		options.url = module.buildUrl( options.url );
		
		me.doAction( 'ea_load', options );
	},
	
	/**
	 * Submits form data
	 * 
	 * @public
	 * @param {Object} options
	 */
	submit : function( options )
	{
		var me = this;
		
		options = options || {};
		
//		// skip submitting of unchanged data
//		if( options.skipDirtyCheck !== true && me.isDirty() == false ) {
//			return;
//		}
//		delete options.skipDirtyCheck;
		
		// build submit action url
		var action = me.submitAction,
		    url = null;
		
		if( action == null ) {
			url = me.module.buildUrl({
				request : 'form',
				name    : me.formName,
				action  : 'submit'
			});
			
		} else if( Ext.isString( action ) ) {
			url = me.module.buildUrl({
				action  : action
			});
			
		} else if( Ext.isArray( action ) ) {
			var module = action.length > 1 ?
					extAdmin.ModuleManager.get( action[0] ) :
					me.module;
			
			url = module.buildUrl({
				action : action[1]
			});
			
		} else {
			Ext.Error.raise({
				msg : 'Invalid submitAction supplied',
				submitAction : action
			});
		}
		
		// build URL based on module info
		options = Ext.applyIf( options, {
			url     : url,
			waitMsg : me.texts.savingData
		});
		
		me.doAction( 'ea_submit', options );
	},
	
	/**
	 * Reconfigures form fields
	 * 
	 * Enables configuring of some of fields properties
	 * (readOnly, disabled, visible, ...) run-time.
	 * 
	 * Usefull for reconfiguring form from server.
	 * 
	 * @public
	 * @param {Object} config
	 */
	reconfigure : function( config )
	{
		var confMapping = {
			readOnly : function( f, v ) { f.setReadOnly( v ); },
			disabled : function( f, v ) { f.setDisabled( v ); },
			visible  : function( f, v ) { f.setVisible( v ); }
		};
		
		if( Ext.isObject( config.fields ) ) {
			var fieldsConfig = config.fields;
			
			for( var fieldName in fieldsConfig ) {
				if( fieldsConfig.hasOwnProperty( fieldName ) === false ) {
					continue;
				}
				
				field = this.findField( fieldName );
				
				if( field == null ) {
					continue;
				}
				
				this.applyConfig( field, fieldsConfig[ fieldName ], confMapping );
			}
		}
	},
	
	/**
	 * Applies config on given field
	 * 
	 * @private
	 * @param {Ext.form.field.Base} field
	 * @param {Object} config
	 * @param {Object} mapping
	 */
	applyConfig : function( field, config, mapping )
	{		
		for( var name in mapping ) {
			if( mapping.hasOwnProperty( name ) === false || config.hasOwnProperty( name ) === false || config[name] === undefined ) {
				continue;
			}
			
			mapping[ name ].call( this, field, config[ name ] );		
		}
	}
});