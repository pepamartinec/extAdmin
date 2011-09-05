Ext.define( 'extAdmin.popup.Form',
{
	extend : 'extAdmin.popup.Base',
	
	requires : [
		'Ext.form.Panel',
		'Ext.Error'
	],
	
	/**
	 * Context module
	 * 
	 * @cfg {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * Displayed form
	 * 
	 * @cfg {String} form
	 */
	form : null,
	
	resizable : false,
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;

		var formName     = me.form,
		    fullFormName = 'extAdmin.module.'+ me.module.name +'.'+ formName;
		
		me.panel = Ext.create( fullFormName, {
			width : 800
		});
		
		me.relayEvents( me.panel, [
			'beforeaction',
			'actionfailed',
			'actioncomplete',
			'validitychange',
			'dirtychange'
		]);
		
		me.callParent();
	
		// ====== INIT DIRTY-CHECK ======
		var form = me.panel.getForm(),
		    onDirtyChange = function( form, dirty ) {
				me.confirmBtn.setDisabled( dirty == false );
			};
		
		// force initial check
		form.checkDirty();
		onDirtyChange( form, form.isDirty() );
		
		// bind save-button disabling
		form.on({
			scope : me,
			
			dirtychange    : onDirtyChange,
			beforeaction   : me.suspendControls,
			actioncomplete : me.resumeControls,
			actionfailed   : function( form, action ) {
				me.resumeControls();
				
				if( action instanceof Ext.form.action.Load ) {
					me.doClose();
				}
			}
		});
		
		// bind close-button warning
		me.on( 'beforeclose', function() {
			me.panel.dirtyWarn( me.doClose, me );
			return false;
		});
	},
	
	/**
	 * Returns form panel
	 * 
	 * @return {Ext.Component}
	 */
	getFormPanel : function()
	{
		return this.panel;
	},
	
	/**
	 * Confirm button click handler
	 * 
	 * @private
	 */
	confirm : function()
	{
		var me = this;
		
		me.panel.submit();
	}
});