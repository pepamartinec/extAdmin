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
		
		// determine full form name
		var formName = config.params.form;
		
		if( Ext.isString( formName ) ) {
			formName = [ config.module.name, formName ];
		}
		
		if( Ext.isArray( formName ) === false || formName.length !== 2 ) {
			Ext.error.raise({
				msg    : 'Invalid from name supplied in action parameters',
				action : config
			});
		}
		
		config.params.form = formName;
		
		// determine full preload action
		var preload = config.params.preload;
		
		if( Ext.isString( preload ) ) {
			preload = [ config.module.name, preload ];
		}
		
		if( Ext.isArray( preload ) === false || preload.length !== 2 ) {
			Ext.error.raise({
				msg    : 'Invalid from name supplied in action parameters',
				action : config
			});
		}
		
		config.params.preload = preload;
		
		
		Ext.applyIf( config, {
			dataDep : preload[1] != 'default'
		});	
		
		me.callParent( arguments );
	},

	handler : function( records, cb, cbScope )
	{
		var me = this;
		
		// create popup
		var fullFormName = 'extAdmin.module.'+ me.params.form[0] +'.'+ me.params.form[1],
		    popup = Ext.create( 'extAdmin.popup.Form', {
		    	module : me.module,
		    	form   : fullFormName
		    });
		
		popup.getFormPanel().getForm().on( 'actioncomplete', function( form, action ) {
			if( action.type == 'submit' && action.silent != true ) {
				Ext.callback( cb, cbScope );
				popup.close();	
			}
		});
		
		// popup should show before data-load
		// otherwise there could be some race condition and popup title
		// and save button state are not set well
		popup.show();
		
		// load data when recordID specified
		var preload  = me.params.preload,
		    recordID = records[0] ? records[0].getId() : null;
		
		if( preload ) {			
			popup.getFormPanel().load({
				module : preload[0],
				type   : preload[1],
				params : { recordID : recordID }
			});
		}
	}
});
