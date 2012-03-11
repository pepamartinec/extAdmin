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
	
	multiRecord : false,
	dataDep  : true,
	iconCls  : 'i-application-form-edit',
	
	params   : {
		target       : 'popup',
		editor       : null,
		loadAction   : null,
		submitAction : null,
		loadDefault  : null // empty/record/...
	},
	
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		var params = me.params;
		
		// choose handler
		var handlerName = params.target +'Run';
		
		if( Ext.isFunction( me[ handlerName ] ) === false ) {
			Ext.Error.raise({
				msg    : 'Invalid editor target',
				target : params.target
			});
		}
		
		me.run = me[ handlerName ];
		
		// determine full editor name & actions
		params.editor    = me.normalizeModuleName( params.editor );
		var editorModule = me.env.getModule( params.editor ),
		    emConfig     = editorModule.config.view;
		
		params.loadAction = me.createAction( params.loadAction, editorModule, emConfig.loadAction );
		params.saveAction = me.createAction( params.saveAction, editorModule, emConfig.saveAction );
	},
	
	popupRun : function( records )
	{
		var me     = this,
		    params = me.params,
		    editor = me.env.getModule( params.editor ).createView(),
		    popup  = null;
		
		// create popup
		try {
			popup = Ext.create( 'extAdmin.component.editor.Popup', {
				editor       : editor,
				loadAction   : params.loadAction,
				submitAction : params.submitAction,
	
				// show popup immediately
				// so we dont have to mask dataView
				autoShow : true
			});
			
		} catch( e ) {
			Ext.Error.raise({
				msg   : e.message,
				stack : e.stack
			});
		}
		
		// load data when recordID specified
		var loadDefault = me.params.loadDefault;
		
		if( loadDefault ) {
			var failureHandler = function() { popup.close(); }; 
			
			editor.load({
				action  : loadDefault,
				record  : records[0].data,
				
				failure   : failureHandler,
				exception : failureHandler
			});
		}
	},
	
	slideinRun : function( records )
	{
		
	},
	
	fullscreenRun : function( records )
	{
		
	}
});
