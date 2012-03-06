Ext.define( 'extAdmin.action.record.Edit',
{	
	extend : 'extAdmin.action.record.AbstractAction',
	
	requires : [
//		'extAdmin.component.editor.Popup',
//		'Ext.LoadMask'
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
		target       : 'popup',
		editor       : null,
		loadAction   : null,
		submitAction : null
	},
	
	constructor : function( config )
	{
		var me = this;
		
		// choose icon
		if( config.iconCls == null ) {
			var load = config.load;
			
			if( load == 'empty' ) {
				config.iconCls = me.self.newIcon;
				
			} else if( load == 'record' ) {
				config.iconCls = me.self.editIcon;
				
			} else {
				config.iconCls = me.self.plainIcon;
			}
		}
		
//		// resolve data dependency
//		if( config.dataDep == null ) {
//			config.dataDep = ( config.load != 'empty' );
//		}
		
		me.callParent( arguments );
		
		var params = me.params;
		
		// choose handler
		var handlerName = params.target +'Handler';
		
		if( Ext.isFunction( me[ handlerName ] ) === false ) {
			Ext.Error.raise({
				msg    : 'Invalid editor target',
				target : params.target
			});
		}
		
		me.handler = me[ handlerName ];
		
		// determine full editor name & actions
		params.editor    = me.normalizeModuleName( params.editor );
		var editorModule = me.env.getModule( params.editor ),
		    emConfig     = editorModule.config.view;
		
		params.loadAction   = me.createAction( params.loadAction,   editorModule, emConfig.loadAction );
		params.submitAction = me.createAction( params.submitAction, editorModule, emConfig.submitAction );
	},
	
	popupHandler : function( records )
	{
		var me     = this,
		    params = me.params;
		
		// create popup
		var popup = Ext.create( 'extAdmin.component.editor.Popup', {
			editor       : me.env.getModule( params.editor ).createView(),
			loadAction   : params.loadAction,
			submitAction : params.submitAction,

			// show popup immediately
			// so we dont have to mask dataView
			autoShow : true
		});
		
		
		
		// load data when recordID specified
//		var data  = me.params.data,
//		    recordId = records[0] ? records[0].getId() : null;
//		
//		if( data ) {			
//			popup.getFormPanel().load({
//				module : data[0],
//				type   : data[1],
//				params : Ext.apply( { recordId : recordId }, me.params.params )
//			});
//		}
	},
	
	slideinHandler : function( records )
	{
		
	},
	
	fullscreenHandler : function( records )
	{
		
	}
});
