Ext.define( 'extAdmin.action.record.Form',
{	
	extend : 'extAdmin.action.RecordAction',
	
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
		params  : {},
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

	handler : function( records )
	{
		var me = this;
		
		// create popup
		var fullFormName = 'extAdmin.module.'+ me.params.form[0] +'.'+ me.params.form[1],
		    popup = Ext.create( 'extAdmin.popup.Form', {
		    	module : me.module,
		    	form   : fullFormName
		    });
		
		// update dataBrowser data on form data change
		popup.getFormPanel().getForm().on( 'dataupdate', function( form, recordId ) {
			me.dataBrowser.recordChangeNotification( recordId );
		});
		
		// popup should show before data-load
		// otherwise there could be some race condition and popup title
		// and save button state are not set well
		popup.show();
		
		// load data when recordID specified
		var preload  = me.params.preload,
		    recordId = records[0] ? records[0].getId() : null;
		
		if( preload ) {			
			popup.getFormPanel().load({
				module : preload[0],
				type   : preload[1],
				params : Ext.apply( { recordId : recordId }, me.params.params )
			});
		}
	}
});
