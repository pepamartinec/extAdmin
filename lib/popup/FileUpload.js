Ext.define( 'extAdmin.popup.FileUpload',
{
	extend : 'extAdmin.popup.Base',
	
	requires : [
		'extAdmin.component.FileUploadForm'
	],
	
	/**
	 * Callback triggered when upload is done
	 * 
	 * @cfg {Function}
	 * @param {Bool} whether upload completes without errors
	 * @param {Array} list of successfully uploaded files
	 */
	resultsCallback : Ext.emptyFn,
	
	/**
	 * Scope for resultsCallback
	 * 
	 * @cfg {Mixed}
	 */
	resultsScope : null,
	
	/**
	 * Module
	 * 
	 * @cfg {String|extAdmin.Module} module
	 */
	module : 'repository',
	
	/**
	 * Upload action name
	 * 
	 * @cfg {String|Null} submitAction
	 */
	submitAction : 'uploadFiles',
	
	/**
	 * Files submit parameters
	 * 
	 * @cfg {Object|Null} submitParams
	 * @property {Object|Null} submitParams
	 */
	submitParams : null,
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		me.panel = Ext.create( 'extAdmin.component.FileUploadForm', {
			module       : me.module,
			submitAction : me.submitAction,
			submitParams : me.submitParams,
			
			listeners : {
				scope  : me,
				submit : me.onFileSubmit
			}
		});
		
		Ext.applyIf( me, {
			width : 600
		});
		
		me.callParent( arguments );
		
		Ext.apply( me, {
			module       : me.panel.module,
			submitAction : me.panel.submitAction,
			submitParams : me.panel.submitParams,			
		});
	},
	
	/**
	 * Confirm button click handler
	 * 
	 * @private
	 */
	confirm : function()
	{
		this.panel.submit();
	},
	
	/**
	 * File submition handler
	 * 
	 * @private
	 * @param {Boolean} success whether all of the files were successfully uploaded
	 * @param {Array} files list of successfully uploaded files
	 */
	onFileSubmit : function( success, files )
	{
		var me = this,
		    ok = me.resultsCallback.call( me.resultsScope, arguments );
		
		if( success && ok !== false ) {
			me.superclass.confirm.call( me );
		}
	},
	
	/**
	 * Shows popup
	 * 
	 * @param {Object|Null} submitParams given parameters will be appended to upload requests
	 */
	show : function( submitParams )
	{
		var me = this;
		
		me.panel.submitParams = Ext.Object.merge( {}, me.submitParams, submitParams );
		
		me.callParent();
	}
});