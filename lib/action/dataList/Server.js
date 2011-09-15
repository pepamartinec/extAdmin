Ext.define( 'extAdmin.action.dataList.Server',
{
	extend : 'extAdmin.action.DataList',
	
	texts : {
		progressTitle : 'Probíhá...'
	},
	
	params : {
		action : null,
		params : null
	},
	
	constructor : function( config )
	{
		var me = this;
		
		if( config.params === undefined ) {
			config.params = {};
		}
		
		if( config.params.action === undefined ) {
			config.params.action = config.name;
		}
		
		me.callParent( arguments );
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