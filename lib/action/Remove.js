Ext.define( 'extAdmin.action.Remove',
{
	extend : 'extAdmin.AbstractAction',
	
	requires : [
		'Ext.MessageBox'
	],
	
	texts : {
		title         : 'Smazat',
		popTitle      : 'Potvrzení smazání',
		popContent    : 'Opravdu chete smazat následující?',
		progressTitle : 'Probíhá mazání'
	},
	
	multiRow : true,
	dataDep  : true,
	iconCls  : 'i-delete',
	
	params : {
		action      : 'remove',
		idName      : 'recordID',
		recordTitle : 'title'
	},
	
	handler : function( records, cb, cbScope )
	{
		var me = this;
		
		// do nothing when no records were supplied
		if( !records.length ) {
			return;
		}
		
		// build confirmation popup content
		var content = me.texts.popContent + '<br /><ul>';
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			content += '<li>' + records[ i ].data[ me.params.recordTitle ] +'</li>';
		}
		content += '</ul>';
		
		// show confirmation popup
		Ext.MessageBox.confirm( me.texts.popTitle, content, function( reply ) {
			if( reply != 'yes' ) {
				return;
			}
			
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
			
	        me.module.request.send({
				params : {
					action : me.params.action
				},
				data : reqData,
				
				complete : function( options, success, response ) {
					// remove progress on response
					progressPopup.close();
					
					// call after-execute callback
					cb.apply( cbScope, [ success, records ] );
				}
			});
		} );
	}
});