Ext.define( 'extAdmin.component.form.action.Submit',
{
	extend : 'Ext.form.action.Submit',
	alias  : 'formaction.ea_submit',
	
	/**
	 * Data submit success handler
	 * 
	 * @private
	 * @param {Object} response
	 */
	onSuccess : function( response )
	{
		var result = this.processResponse( response ),
		    form   = this.form;
		
		// no response from server
		if( result === true ) {			
			this.failureType = Ext.form.action.Action.LOAD_FAILURE;
			form.afterAction( this, false );
			return;
		}
		
		// server indicates invalid data
		if( result.success == false ) {
			if( result.errors ) {
				form.markInvalid( result.errors );
			}
			
			this.failureType = Ext.form.action.Action.SERVER_INVALID;
			form.afterAction( this, false );
		}
		
		// no data from server
		if( result.data == null ) {			
			this.failureType = Ext.form.action.Action.LOAD_FAILURE;
			form.afterAction( this, false );
			return;
		}
		
		// server-side configuration
		if( result.form ) {
			form.reconfigure( result.form );
		}
		
		// fill new data into form
		form.clearValues();
		form.setValues( result.data );
		
		// notify record source about data change
		form.getRecordSource().recordChangeNotification( form.getRecordId() );
		
		form.afterAction( this, true );
	}
});