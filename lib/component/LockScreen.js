Ext.define( 'extAdmin.component.LockScreen',
{
	extend : 'Ext.window.Window',
	
	texts : {
		userFld : 'Uživatel',
		passwordFld : 'Heslo',
		unlockBtn : 'Odemknout',
		logoutBtn : 'Odhlásit',
		maskMsg   : 'Ověřuji'
	},
	
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
			closable  : false,
			modal     : true,
			movable   : false,
			resizable : false,
			
			width  : 550,
			height : 200,
			
			layout : 'border',			
			items : [{
				region : 'west',
				
				xtype  : 'component',
				width  : 150,
				autoEl : {
					tag: 'img'
				},
				itemId: 'avatarField'	
			},{	
				region : 'center',
				
				xtype  : 'form',
				itemId : 'formPanel',
				
				bodyPadding : 5,
				items  : [{					
					xtype  : 'component',
					
					height : 30,
					margin : 10,
					style  : 'color: red;\nfont-weight: bold;',
					
					hidden : true,
					itemId : 'messageBox'
				},{
					xtype      : 'displayfield',
					fieldLabel : me.texts.userFld,
					anchor     : '100%',
					name       : 'username',
					itemId     : 'usernameField'
				},{
					xtype      : 'textfield',
					fieldLabel : me.texts.passwordFld,
					anchor     : '100%',
					name       : 'password',
					inputType  : 'password',
					itemId     : 'passwordField',
					
					listeners: {
						specialkey: function( form, e ) {
							if( e.getKey() == e.ENTER ) {
								me.unlock();
							}
						}
					}
				}]
			}],
			
			buttons : [{
				xtype   : 'button',
				text    : me.texts.unlockBtn,
				iconCls : 'i-unlock',
				type    : 'submit',
				itemId  : 'unlockBtn'
			},{
				xtype   : 'button',
				text    : me.texts.logoutBtn,
				iconCls : 'i-exit',
				itemId  : 'logoutBtn'
			}]
		});
		
	
		me.addEvents( 'success', 'failure', 'logout' );
		
		me.callParent();
		
		var items = [ 'avatarField', 'formPanel', 'messageBox', 'usernameField', 'passwordField', 'unlockBtn', 'logoutBtn' ],
		    iName;
		
		for( var i = 0, il = items.length; i < il; ++i ) {
			iName = items[ i ];
			
			me[ iName ] = me.down( '#'+iName );
		}
		
//		this.defaultButton = this.passwordField;
		
		// load user data on show
		me.on( 'show', function() {
			var user = this.authHandler.getCurrentUser();
			
			me.usernameField.setValue( user.firstName +' '+user.lastName +' ('+ user.username +')' );
			me.avatarField.getEl().set({
				src : user.avatar
			});
			me.passwordField.focus();
		} );
		
		me.unlockBtn.on( 'click', me.unlock, me );
		me.logoutBtn.on( 'click', me.logout, me );
	},
	
	/**
	 * 
	 * @param text
	 */
	setMessage : function( text )
	{
		this.messageBox.show().update( text );
		
		return this;
	},

	/**
	 * 
	 */
	unlock : function()
	{
		var me    = this,
		    username = me.authHandler.getCurrentUser().username,
		    password = me.passwordField.getValue();
		
		me.setLoading({
			msg : me.texts.maskMsg +'...'
		});
		me.passwordField.reset();
		
		me.authHandler.login( username, password, function( success, response ) {
			me.setLoading( false );
			
			if( success ) {
				me.fireEvent( 'success', me );
				me.messageBox.hide();
				
			} else {
				me.fireEvent( 'failure', me );
				me.setMessage( response.message );
				me.passwordField.focus();
			}
		});
		
		return me;
	},
	
	/**
	 * 
	 */
	logout : function()
	{
		var me = this;
		
		me.fireEvent( 'logout', me );
		me.authHandler.logout();
		
		return me;
	}
});