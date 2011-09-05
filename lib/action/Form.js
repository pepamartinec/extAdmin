Ext.define( 'extAdmin.action.Form',
{	
	extend : 'extAdmin.AbstractAction',
	
	requires : [
		'extAdmin.popup.Form',
		'Ext.LoadMask'
	],
	
	statics : {
		plainIcon : 'i-form',
		newIcon   : 'i-form-add',
		editIcon  : 'i-form-edit',
		
		bodyMask  : null
	},
	
	multiRow : false,
	dataDep  : true,
	iconCls  : 'i-form',
	
	params   : {
		form    : null, // module form name
		preload : null, // 'default' | 'record' | custom
		model   : null
	},
	
	constructor : function( module, name, definition )
	{
		// choose icon
		if( !definition.iconCls ) {			
			if( definition.params.preload == 'default' ) {
				definition.iconCls = this.self.newIcon;
			} else if( definition.params.preload == 'record' ) {
				definition.iconCls = this.self.editIcon;
			} else {
				definition.iconCls = this.self.plainIcon;
			}
		}
		
		Ext.applyIf( definition, {
			dataDep : definition.params.preload != 'default'
		});	
		
		this.callParent( arguments );
	},

	handler : function( records, cb, cbScope )
	{
		var me = this;
		
		// create popup
		var popup = Ext.create( 'extAdmin.popup.Form', {
			module : me.module,
			form   : me.params.form,
		});
		
		popup.getFormPanel().getForm().on( 'actioncomplete', function( form, action ) {
			if( action.type == 'submit' && action.silent != true ) {
				Ext.callback( cb, cbScope );
				popup.close();	
			}
		});
		
		// load data when recordID specified
		var preload  = me.params.preload,
		    recordID = records[0] ? records[0].getId() : null;
		    
		if( preload ) {			
			popup.getFormPanel().load({
				type    : me.params.preload,
				params  : { recordID : recordID }
			});
		}
		
		popup.show();
	}
});
