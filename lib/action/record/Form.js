Ext.define( 'extAdmin.action.record.Form',
{	
	extend : 'extAdmin.action.record.AbstractAction',
	
	requires : [
		'extAdmin.popup.Form',
		'Ext.LoadMask'
	],
	
	statics : {
		plainIcon : 'i-application-form',
		newIcon   : 'i-application-form-add',
		editIcon  : 'i-application-form-edit',
		
		bodyMask  : null
	},
	
	multiRow : false,
	dataDep  : true,
	iconCls  : 'i-application-form',
	
	params   : {
		form   : null, // module form name
		data   : null, // 'default' | 'record' | custom
		params : {},
		model  : null
	},
	
	constructor : function( config )
	{
		var me = this,
		    data = config.params.data;
		
		// choose icon
		if( config.iconCls == null ) {			
			if( data == 'empty' ) {
				config.iconCls = me.self.newIcon;
				
			} else if( data == 'record' ) {
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
			Ext.Error.raise({
				msg    : 'Invalid form name supplied in action parameters',
				action : config
			});
		}
		
		config.params.form = formName;
		
		// determine full preload action
		var data = config.params.data;
		
		if( Ext.isString( data ) ) {
			data = [ config.module.name, data ];
		}
		
		if( Ext.isArray( data ) === false || data.length !== 2 ) {
			Ext.Error.raise({
				msg    : 'Invalid data supplied in action parameters',
				action : config
			});
		}
		
		config.params.data = data;
		
		
		Ext.applyIf( config, {
			dataDep : data[1] != 'empty'
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
		var data  = me.params.data,
		    recordId = records[0] ? records[0].getId() : null;
		
		if( data ) {			
			popup.getFormPanel().load({
				module : data[0],
				type   : data[1],
				params : Ext.apply( { recordId : recordId }, me.params.params )
			});
		}
	}
});
