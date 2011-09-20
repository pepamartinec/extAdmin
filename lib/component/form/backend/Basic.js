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
		
		options = options || {};
		
		// build URL based on module info
		options = Ext.applyIf( options, {
			url : me.module.buildUrl({
				request : 'form',
				name    : me.formName,
				action  : 'load'+ Ext.String.capitalize( options.type || 'record' ) +'Data'					
			}),
			
			waitMsg : me.texts.loadingData
		});
		delete options.type;
		
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
		
		// skip submitting of unchanged data
		if( options.skipDirtyCheck !== true && me.isDirty() == false ) {
			return;
		}
		delete options.skipDirtyCheck;
		
		// build URL based on module info
		options = Ext.applyIf( options, {
			url : me.module.buildUrl({
				request : 'form',
				name    : me.formName,
				action  : 'submit'					
			}),
			
			waitMsg : me.texts.savingData
		});
		
		me.doAction( 'ea_submit', options );
	},
});