Ext.define( 'extAdmin.module.email.EditForm',
{
	extend : 'extAdmin.component.form.Form',
	
	lockRecipients : true,
	lockCopy       : true,
	lockSubject    : false,
	lockContent    : false,
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		me.sendBtn = Ext.create( 'Ext.button.Button', {
			text    : 'Odeslat',
			handler : function() { me.submit(); }
		});
		
		Ext.apply( me, {
			bodyPadding : 5,
			backend : {
				xtype  : 'basic',
				module : me.module,
				submitAction : [ 'email', 'send' ]
			},
			
			items   : [],
			buttons : [ me.sendBtn ]
		});
				
		me.callParent( arguments );
		
		me.getForm().on( 'actioncomplete', me.reconfigureFields, me );
		
		// ====== ADDRESS-BOOK STORE ======
		if( me.lockRecipients === false || me.lockCopy === false ) {			
			addressBook = Ext.create( 'Ext.data.Store', {
				fields : [ 'address' ]
			});
		}
		
		// ====== RECIPIENTS ======
		var recipientsField = {
			name       : 'recipients',
			fieldLabel : 'Komu'
		};
		
		if( me.lockRecipients ) {
			Ext.apply( recipientsField, {
				xtype    : 'textfield',
				readonly : true,
				
				getValue : function() {
					var value = Ext.form.field.Display.prototype.getValue.call( this );
					return value.split(',');
				},
				
				getSubmitValue : function() {
					var value = {};
					value[ this.name ] = this.getValue();
					return value;
				}
			});
			
		} else {
//			Ext.apply( recipientsField, {
//				xtype        : 'boxselect',
//				queryMode    : me.addressSearchMode,
//				displayField : 'address',
//				store        : addressBook
//			});
			
			Ext.apply( recipientsField, {
				xtype : 'textfield'
			});
		}
		
		me.recipientsField = me.add( recipientsField );
		
		// ====== COPY ======
		var copyField = {
			name       : 'copy',
			fieldLabel : 'Kopie'
		};
				
		if( me.lockCopy ) {
			Ext.apply( copyField, {
				xtype : 'displayfield'
			});
			
		} else {
			Ext.apply( copyField, {
				xtype        : 'boxselect',
				queryMode    : me.addressSearchMode,
				displayField : 'address',
				store        : addressBook
			});
		}
		
		me.copyField = me.add( copyField );
		
		// ====== SUBJECT ======
		var subjectField = {
			name       : 'subject',
			fieldLabel : 'Předmět'
		};
				
		if( me.lockSubject ) {
			Ext.apply( subjectField, {
				xtype : 'displayfield'
			});
			
		} else {
			Ext.apply( subjectField, {
				xtype : 'textfield'
			});
		}
		
		me.subjectField = me.add( subjectField );
		
		// ====== CONTENT ======
		var contentField = {
			name       : 'content',
			height     : 500,
			fieldLabel : 'Obsah'
		};
		
		if( me.lockContent ) {
			Ext.apply( contentField, {
				xtype : 'displayfield'
			});
			
		} else {
			Ext.apply( contentField, {
				xtype : 'tinymcefield'
			});
		}
		
		me.contentField = me.add( contentField );
	},
	
	/**
	 * Reconfigures fields 
	 * 
	 */
	reconfigureFields : function()
	{
		var me   = this,
		    data = me.getForm().getValues();
		
		me.copyField.setVisible( me.lockCopy === false || data.copy );
	}
});