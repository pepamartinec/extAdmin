Ext.define( 'extAdmin.action.dataList.Form',
{	
	extend : 'extAdmin.action.DataList',
	
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
	
	constructor : function( config )
	{
		var me = this,
		    preload = config.params.preload;
		
		// choose icon
		if( config.iconCls == null ) {			
			if( preload == 'default' ) {
				config.iconCls = me.self.newIcon;
				
			} else if( preload == 'record' ) {
				config.iconCls = me.self.editIcon;
				
			} else {
				config.iconCls = me.self.plainIcon;
			}
		}
		
		Ext.applyIf( config, {
			dataDep : preload != 'default'
		});	
		
		me.callParent( arguments );
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
