Ext.define( 'extAdmin.ErrorHandler',
{
	singleton : true,
	
	requires : [
		'extAdmin.popup.Error'
	],
	
	config : {
		debug : false,
		redirectUrl : 'scripts/admin.php'
	},
	
	texts : {
		fatal : {
			title : 'Chyba aplikace',
			text  : 'V aplikaci došlo k chybě'
		},
		
		recoverable : {
			title : 'Chyba'
		},
		
		request : {
			readMsg : 'Při načítání dat došlo k chybě.',
			writeMsg : 'Při ukládání dat došlo k chybé.',
			defaultText : 'Zkuste prosím akci opakovat, případně kontaktuje technickou podporu.'
		},
		
		
		msgClient : 'V aplikaci došlo k neočekávané chybě.',
		msgServer : 'Při komunikace se serverem došlo k chybě.'
	},
	
	constructor : function( config )
	{
		var me = this;
		
		me.initConfig( config );
		me.callParent( arguments );
		
		me.popup = Ext.create( 'extAdmin.popup.Error', {
			defaults : {
				cls     : 'fatal',
				title   : me.texts.title,
				text    : me.texts.text,
				handler : me.popup_redirect
			}
		});
		
		Ext.Error.handle = Ext.Function.bind( me.handleExtError, me );
		Ext.Ajax.on( 'requestexception', me.handleDataRequestException, me );
		
		me.popup_hide     = function() { me.popup.hide(); };
		me.popup_redirect = function() { window.location.reload(); };
	},
	
	/**
	 * Generic error handler
	 * 
	 * @private
	 * @param  {Ext.Error} error
	 * @return {Boolean}
	 */
	handle : function( error )
	{
		var me = this;
		
		if( me.fatalPopup == null ) {
			me.fatalPopup = Ext.create( 'extAdmin.popup.error.Fatal' );
		}
		
		if( me.debug ) {
			return false;
			
		} else {
			me.fatalPopup.setDetail( error.msg );
			me.fatalPopup.show();
			
			return true;
		}
	},
	
	/**
	 * Handles client-side application failure
	 * 
	 * @param {Ext.Error} error
	 */
	handleExtError : function( error )
	{
		var me = this;
		
		me.fireFatal({
			text   : me.texts.msgClient,
			detail : '<p>'+error.msg+'</p>'
		});
	},
	
	/**
	 * Handles server-side application failure
	 * 
	 * @param {Ext.data.Connection} conn
	 * @param {Object} response
	 * @param {Object} options
	 */
	handleDataRequestException : function( conn, response, options )
	{
		var me = this;

		// try to get a message
		var result;
		try {
			result = Ext.JSON.decode( response.responseText );
		} catch( err ) {
			result = {
				message : 'Invalid JSON response: '+response.responseText
			};
		}
		
		// build template
		tpl = Ext.create( 'Ext.XTemplate', [
			'<p>{result.message}</p>',
			'<table>',
				'<tr><th>Action</th><td>{conn.action}</td></tr>',
				'<tr><th>Url</th><td>{conn.request.url}</td></tr>',
			'</table>'
		]);
		
		// show
		me.fireFatal({
			text   : me.texts.msgServer,
			detail : tpl.apply({
				conn     : conn,
				response : response,
				result   : result
			})
		});
	},
	
	/**
	 * Data request failure handler
	 * 
	 * @param response
	 */
	handleDataRequestFailure : function( conn, response, options )
	{
		var me = this;
		
		// build template
		tpl = Ext.create( 'Ext.XTemplate', [
			'<table>',
				'<tr><th>Action</th><td>{conn.action}</td></tr>',
				'<tr><th>Url</th><td>{conn.request.url}</td></tr>',
			'</table>'
		]);
		
		me.fireRecoverable({
			text : me.texts.request[ conn.action == 'read' ? 'readMsg' : 'writeMsg' ] +
			       '<br />' +( conn.error || me.texts.request.defaultText ),
			       
			detail : tpl.apply({
				conn     : conn,
				response : response
			})
		});
	},
	
	/**
	 * Form action failure handler
	 * 
	 * @param response
	 */
	handleFormActionFailure : function( action )
	{	
		var me = this;
		
		me.fireRecoverable({
			text : me.texts.request[ action instanceof Ext.form.action.Load ? 'readMsg' : 'writeMsg' ] +
	    		'<br />' +( action.result.message || me.texts.request.defaultText )
		});
	},
	
	fireFatal : function( options )
	{
		var me = this;
		
		Ext.applyIf( options, {
			cls   : 'fatal',
			title : me.texts.fatal.Title,
			handler : me.popup_redirect
		});
		
		return me.popup.show( options );
	},
	
	fireRecoverable : function( options )
	{
		var me = this;
		
		Ext.applyIf( options, {
			cls     : 'recoverable',
			title   : me.texts.recoverable.title,
			handler : me.popup_hide
		});
		
		return me.popup.show( options );
	}
});