Ext.define( 'extAdmin.popup.Error',
{
	extend : 'Ext.window.Window',
	
	requires : [
		'Ext.Component',
		'Ext.form.FieldSet',
		'Ext.button.Button'
	],
	
	config : {
		text : null
	},
	
	texts : {
		detail : 'Detail'
	},
	
	defaults : {
		cls     : null,
		title   : null,
		text    : null,
		handler : null
	},
	
	cls : 'error-box',
	
	constructor : function( config )
	{
		var me = this;
		
		me.initConfig( config );
		me.callParent( arguments );
	},
	
	initComponent : function()
	{
		var me = this;
		
		me.msgField = Ext.create( 'Ext.Component', {
			cls   : 'message',
			html  : me.text,
			frame : false
		});
		
		me.detailField = Ext.create( 'Ext.form.FieldSet', {
			xtype       : 'fieldset',
			cls         : 'detail',
			title       : me.texts.detail,
			collapsible : true,
			collapsed   : true,
			hidden      : true,
			autoScroll  : true
		});
		
		me.okBtn = Ext.create( 'Ext.button.Button', {
			text : 'OK',
			handler : me.defaults.handler
		});
		
		Ext.apply( me, {
			hideMode    : 'offsets',
			closeAction : 'hide',
			closable    : false,
			resizable   : true,
			modal       : true,
			
			bodyPadding : 10,
			
			width     : 600,
			minWidth  : 250,
			maxWidth  : 600,
			minHeight : 110,
			maxHeight : 500,
			constrain : true,
			
			layout : {
				type : 'anchor'
			},
			
			items   : [ me.msgField, me.detailField ],
			buttons : [ me.okBtn ]
		});
		
		me.callParent( arguments );
		
		me.tmpCls = null;
		me.queue = [];
	},
	
	show : function( options )
	{
		var me = this;
		
		if( me.isVisible() ) {
			me.queue.push( options );
			return;
		}
		
		me.setTitle( options.title || me.defaults.title );
		me.setText( options.text || me.defaults.text );
		me.okBtn.handler = options.handler || me.detaults.handler;
		
		if( me.additionalCls ) {
			me.removeCls( me.tmpCls );
			me.tmpCls = null;
		}
		
		if( options.cls ) {
			me.addCls( options.cls );
			me.tmpCls = options.cls;
		}
		
		me.callParent();
		
		me.setDetail( options.detail );
	},
	
	hide : function()
	{
		var me = this;
		
		me.callParent();
		
		if( me.queue.length > 0 ) {
			me.show( me.queue.shift() );
		}
	},
	
	applyText : function( text )
	{
		if( this.msgField ) {
			this.msgField.update( text );
		}
		
		return text;
	},
	
	setDetail : function( detail )
	{
		var detailFld = this.detailField,
		    detailEl  = detailFld.getTargetEl();
		
		detailEl.innerHTML = '';
		
		if( detail == null ) {
			detailFld.setVisible( false );
			
		} else {
			if( Ext.isString( detail ) ) {
				detailEl.innerHTML = detail;
				
			} else {
				detailEl.appendChild( detail );
			}
			
			detailFld.setVisible( true );
		}
	}
});