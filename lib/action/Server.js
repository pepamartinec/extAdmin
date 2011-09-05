Ext.define( 'extAdmin.action.Server',
{
	extend : 'extAdmin.AbstractAction',
	
	texts : {
		progressTitle : 'Probíhá...'
	},
	
	multiRow : false,
	dataDep  : true,
	
	params : {
		action : null,
		params : null
	},
	
	handler : function( records, cb, cbScope )
	{
		var me = this;
		
		// create progress popup
		var progressPopup = Ext.MessageBox.progress( me.texts.progressTitle );
		
		// pick IDs ofselected records
	    var IDs = [];
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			var id = records[ i ].internalId;
			
			if( id ) {
				IDs.push( id );
			}
		}
		
		var data = Ext.apply( {}, me.params.params, { recordIDs : IDs });
		
		// send action request		
        me.module.request.send({
			params : {
				action : me.params.action
			},
			data : data,
			
			complete : function( options, success, response ) {
				// remove progress on response
				progressPopup.close();
				
				// call after-execute callback
				Ext.callback( cb, cbScope, [ success, records ] );
			}
		});
	}
});