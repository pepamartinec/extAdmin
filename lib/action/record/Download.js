Ext.define( 'extAdmin.action.record.Download',
{	
	extend : 'extAdmin.action.RecordAction',
	
	texts : {
		progressTitle : 'Připravuji...'
	},
	
	params   : {
		action : null,
		params : null,
		idName : 'recordIDs'
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
		var progressPopup = Ext.MessageBox.wait( me.texts.progressTitle, '' );
		
		// add IDs of records
	    var IDs = [];
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			var id = records[ i ].internalId;
			
			if( id ) {
				IDs.push( id );
			}
		}
		
		// build target URL
		var targetModule,
		    targetAction;
		
		if( Ext.isArray( me.params.action ) ) {
			targetModule = me.params.action[0];
			targetAction = me.params.action[1];
			
		} else {
			targetModule = me.module;
			targetAction = me.params.action;
		}
        
		var urlParams = Ext.applyIf( {
			action : targetAction
		}, me.params.params );
		
		urlParams[ me.params.idName ] = IDs;
		
		// create iFrame
		var frame = document.createElement( 'iframe' );
		
		Ext.fly( frame ).set({
			cls : Ext.baseCSSPrefix + 'hide-display',
			src : targetModule.buildUrl( urlParams )
		});
		
		// setup callback
		frame.onload = function() {
			progressPopup.close();
			me.dataBrowser.getDataList().getStore().load();
			
			// proccess possible response
			var responseText = frame.contentDocument.body.innerHTML,
			    response;
			
			if( responseText == '' ) {
				response = { success : true };
				
			} else {
				try {
					response = Ext.JSON.decode( responseText );
					
				} catch( e ) {
					response = { success : false };
				}
			}
			
			// destroy frame delayed
			Ext.Function.defer( function() { frame.parentNode.removeChild( frame ); }, 1000 );
		};		
		
		// run
		document.body.appendChild( frame );
	}
});
