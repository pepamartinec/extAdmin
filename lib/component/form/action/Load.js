Ext.define( 'extAdmin.component.form.action.Load',
{
	extend : 'Ext.form.action.Load',
	alias  : 'formaction.ea_load',
	
	/**
	 * Data load success handler
	 * 
	 * @private
	 * @param {Object} response
	 */
	onSuccess : function( response )
	{
		var result = this.processResponse( response ),
		    form   = this.form;
		
		if( result === true || result.success == false || result.data == null ) {			
			this.failureType = Ext.form.action.Action.LOAD_FAILURE;
			form.afterAction( this, false );
			return;
		}
		
		// server-side configuration
		if( result.form ) {
			form.reconfigure( result.form );
		}
		
		form.clearValues();
		form.setValues( result.data );
		
		form.afterAction( this, true );		
	}
});