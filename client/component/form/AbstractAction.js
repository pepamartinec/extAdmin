Ext.define( 'extAdmin.component.form.AbstracrAction',
{		
	extend : 'extAdmin.action.AbstractAction',
	
	isPrototype : true,
	category    : 'form',
	
	/**
	 * Form
	 * 
	 * @protected
	 * @property {extAdmin.component.form.Form} form
	 */
	form : null,
	
	/**
	 * Action constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		extAdmin.applyConfig( me, {
			form : config.form
		});
	},
	
	/**
	 * Updates action state according to current configuration
	 * 
	 */
	updateState_dataIndep : function()
	{
		this.setDisabled( false );
	}
});
