Ext.define( 'extAdmin.AuthManager',
{
	extend : 'Ext.util.Observable',
	singleton : true,
	
	requires : [
		'extAdmin.component.LockScreen'
	],
	
	loginScreenUrl  : null,
	loginHandlerUrl : null,
	
	constructor : function()
	{
		var me = this;
		
		me.callParent( arguments );
		
		// local connection to authenticvation handler
		me.authConn = new Ext.data.Connection({
			method        : 'POST',
			url           : me.loginHandlerUrl,
			serializeForm : function( form ) {
				return Ext.lib.Ajax.serializeForm( form );
			}
		});
		
		me.requestsQueue = [];
		me.loginPopup    = null;
		me.currentUser   = null;
		
		Ext.Ajax.on( 'requestexception', me.onException, me );
	},
	
	init : function( config )
	{
		var me = this;
		
		Ext.apply( me, config );
		
		me.authConn.url = me.loginHandlerUrl;
	},
	
	isUserLogged : function()
	{
		return this.currentUser != null;
	},
	
	getCurrentUser : function()
	{
		return this.currentUser;
	},
	
	refreshCurrentUser : function( callback, callbackScope )
	{
		var me = this;
		
		me.authConn.request({
			params : {
				action : 'ping'
			},
			
			callback : function( options, success, response ) {
				response = Ext.JSON.decode( response.responseText );
				success  = success && response.success;
				
				if( success ) {
					me.currentUser = response.data;
					
					Ext.callback( callback, callbackScope, [ success, response ] );
					
				} else {
					window.location = me.loginScreenUrl;
				}
			}
		});		
	},
	
	login : function( username, password, callback, callbackScope )
	{
		var me = this;
		
		me.authConn.request({
			params : {
				action   : 'login',
				username : username,
				password : password
			},
			
			callback : function( options, success, response ) {
				response = Ext.JSON.decode( response.responseText );
				success  = success && response.success;
				
				Ext.callback( callback, callbackScope, [ success, response ] );
			}
		});
	},
	
	logout : function( callback, callbackScope )
	{
		var me = this;
		
		me.authConn.request({
			params : {
				action   : 'logout'
			},
			
			callback : function( options, success, response ) {
				response = Ext.util.JSON.decode( response.responseText );
				success  = success && response.success;
				
				Ext.callback( callback, callbackScope, [ success, response ] );
				
				window.location = _this.loginScreenUrl;
			}
		});		
	},
	
	onException : function( connection, response, options )
	{
		var me = this;
		
		switch( response.status ) {
			case 401:
				me.requestsQueue.push( options );
				me.showLoginPopup( Ext.JSON.decode( response.responseText ).message );
				break;
		}
	},
	
	runQueuedRequests : function()
	{
		var me = this;
		
		while( me.requestsQueue.length > 0 ) {
			var request = me.requestsQueue.shift();
			
			Ext.Ajax.request( request );
		}
	},	
	
	showLoginPopup : function( errorMessage )
	{
		var me = this;
		
		if( me.loginPopup == null ) {			
			me.loginPopup = Ext.create( 'extAdmin.component.LockScreen', {
				authHandler : me,
				y           : 50,
				
				listeners : {
					success : function() {
						me.loginPopup.hide();
						me.runQueuedRequests();
					}
				}
			});
		}
		
		me.loginPopup.setMessage( errorMessage ).show();
	}
	
}, function() {
	
	Ext.define( 'extAdmin.AuthManager.User', {
		extend : 'Ext.data.Model',
		
		fields : [{
			name : 'firstName'
		},{
			name : 'lastName'
		},{
			name : 'userName'
		}]
	});
	
});