Ext.define( 'extAdmin.action.dataList.Server',
{
	extend : 'extAdmin.action.DataList',
	
	texts : {
		progressTitle : 'Probíhá...'
	},
	
	params : {
		action : null,
		params : null,
		idName : 'recordID'
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
		
		// pick IDs of removed records
	    var IDs = [];
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			var id = records[ i ].internalId;
			
			if( id ) {
				IDs.push( id );
			}
		}
		
		// send removal request
		var reqData = {};
        reqData[ me.params.idName ] = IDs;
        
        if( Ext.isObject( me.params.params ) ) {
        	Ext.apply( reqData, me.params.params );
        }
		
        me.module.request.send({
			params : {
				action : me.params.action
			},
			data : reqData,
			
			complete : function( options, success, response ) {
				// remove progress on response
				progressPopup.close();
				
				// refresh dataList
				// FIXME implement more abstract way (do not call getStore().load() directly)
				me.dataBrowser.getDataList().getStore().load();
			}
		});
	}
});