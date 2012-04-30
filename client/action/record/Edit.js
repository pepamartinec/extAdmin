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
	iconCls     : 'i-application-form-edit',
	
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
		
		// watch for data changes
		editor.on( 'create', me.onEditorCreate, me );
		editor.on( 'update', me.onEditorUpdate, me );
		
		// load data when recordID specified
		var loadDefault = me.params.loadDefault;
		
		if( loadDefault ) {
			var failureHandler = function() { popup.close(); },
			    data           = [];
			
			if( Ext.isArray( records ) ) {
				Ext.Array.forEach( records, function( record ) {
					data.push( record.data );
				});
			}
			
			editor.loadData({
				action : loadDefault,
				data   : data[0], // TODO should server receive all records as array or just the first one?
				
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
		
	},
	
	onEditorUpdate : function( editor, data )
	{
		var me = this;
		
		me.component.notifyRecordsChange({
			'updated' : [ editor.getRecordId() ]  
		});
	},
	
	onEditorCreate : function( editor, data )
	{
		var me = this;
		
		me.component.notifyRecordsChange({
			'created' : [ editor.getRecordId() ] 
		});
	}
});
