Ext.define( 'extAdmin.action.record.Delete',
{
	extend : 'extAdmin.action.record.AbstractAction',

	requires : [
		'Ext.window.MessageBox'
	],

	texts : {
		title         : 'Smazat',
		popTitle      : 'Potvrzení smazání',
		popContent    : 'Opravdu chete smazat následující?',
		progressTitle : 'Probíhá mazání'
	},

	multiRecord : true,
	iconCls     : 'i-delete',

	params : {
		action      : 'delete',
		recordTitle : 'title'
	},

	run : function( records )
	{
		var me = this;

		// do nothing when no records were supplied
		if( records.length == 0 ) {
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

			// pick record data
			var data = Ext.Array.map( records, function( record ) {
				return record.getData();
			});

			// send request
	        me.module.runAction( me.params.action, {
				data : {
					records : data,
				},

				complete : function( response ) {
					// remove progress on response
					progressPopup.close();

					if( response.success === true ) {

						// refresh dataList
						me.component.notifyRecordsChange({
							'delete' : records
						});

					} else {

						// FIXME handle delete failure
						Ext.Error.raise({
							msg : 'Data deletion failed',
							response : response
						});
					}
				}
			});
		} );
	}
});