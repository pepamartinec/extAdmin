Ext.define( 'extAdmin.widget.form.tinyMce.TinyMce',
{
	extend : 'Ext.form.field.TextArea',
	
	requires : [
		'extAdmin.widget.form.tinyMce.plugin.GalleryBrowser',
		
		'extAdmin.component.GalleryBrowser',
		'extAdmin.component.RepositoryBrowser'
	],
	
	alias: [ 'widget.tinymce', 'widget.tinymcefield' ],
	
	statics : {
		setup : {
			simple : {
				entity_encoding : 'raw'
			},
			
			advanced : {
				theme  : 'advanced',
				
				// configure plugins
				plugins : '-galleryBrowser,autolink,lists,pagebreak,table,advimage,advlink,media,print,contextmenu,paste,visualchars,nonbreaking',
				
				relative_urls      : true,
				convert_urls       : true,
				document_base_url  : document.baseURI,
				// remove_script_host : true,
				entity_encoding	   : 'raw',				
				
				theme_advanced_buttons1 : 'undo,redo,print,fullscreen,|,bold,italic,underline,strikethrough,sub,sup,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,outdent,indent,blockquote',
				theme_advanced_buttons2 : 'link,unlink,anchor,image,galleryBrowser,|,visualchars,nonbreaking,pagebreak,code',
				theme_advanced_buttons3 : ''
			}
		},
		
		showFileBrowser : function( fieldName, url, type, window )
		{
			switch( type ) {
				case 'image':
					Ext.create( 'extAdmin.popup.Lookup', {
						closeAction    : 'hide',
						selectionMode  : 'single',
						selectionForce : true,
						autoShow       : true,
						
						panel : {
							ltype   : 'gallery',
							albumID : 1
						},
						
						onSelection : function( images ) {
							var image = images[0];
							
							window.document.getElementById( fieldName ).value = image.get('thumb');
						}
					});
					break;
					
				default:
					Ext.create( 'extAdmin.popup.Lookup', {
						closeAction    : 'hide',
						selectionMode  : 'single',
						selectionForce : true,
						autoShow       : true,
						
						panel : {
							ltype : 'repository',
							uploadPopup : {
								module       : 'repository',
								submitAction : 'uploadFiles'
							}
						},
						
						onSelection : function( files ) {
							var file = files[0];
							
							window.document.getElementById( fieldName ).value = file.get('href');
						}
					});
					break;
			}
		}
	},
	
	height : 300,
	
	editor : null,
	
	initComponent : function()
	{
		var me = this;
		
		if( me.setup == null ) {
			me.setup = me.self.setup.advanced;
			
		} else if( Ext.isString( me.setup ) ) {
			me.setup = me.self.setup[ me.setup ];
		}
		
		me.callParent( arguments );
	},
	
	onRender : function()
	{
		var me = this;
		
		me.callParent( arguments );
					
		me.setup = Ext.apply( {}, me.setup, {
			language : 'cs',
			width  : '100%',
			height : '100%',
			
			file_browser_callback : me.self.showFileBrowser,
			
			setup : function( ed ) {				
				ed.onInit.add( function( ed ) {
					var iFrame = Ext.get( me.editor.id +'_ifr' ),
					    container = iFrame.hasCls( '.mceIframeContainer' ) ? iFrame : iFrame.up( '.mceIframeContainer' );
					
					// fix iframe height glitch
					container.setStyle( 'height', '100%' );
					container.parent().setStyle( 'height', '100%' );
					
					iFrame.setStyle( 'height', '5px' );
					Ext.Function.defer( iFrame.setStyle, 100, iFrame, [ 'height', '100%' ] );
					
					// force values sync
					//me.setValue(  );
					var c = ed.getContent();
				});
				
				ed.onPostRender.add( function( ed ) {
					var el = Ext.fly( ed.settings.content_editable ? ed.getBody() : ed.getWin() );
					
					el.on( 'blur', me.onBlur, me,
						this.inEditor && Ext.isWindows && Ext.isGecko ? { buffer: 10} : null
					);
					
					var c = ed.getContent();
				});
				
				ed.onBeforeRenderUI.add( function( ed ) {
					ed.windowManager = Ext.create( 'extAdmin.widget.form.TinyMce.WindowManager', {
						field  : me,
						editor : ed
					});
				});
				
				ed.onChange.add( function( ed ) {
					me.checkChange();
				});
				
				ed.onKeyUp.add( function( ed ) {
					if( me.editor.isDirty() ) {
						me.checkChange();
					}
				});
			}
		} );
		
		me.editor = new tinymce.Editor( this.inputEl.id, me.setup );
		me.editor.render();
		
		tinyMCE.add( me.editor );
	},
	
	onDestroy: function()
	{
		var me = this;
		
		if( me.editor ) {
			me.editor.remove();
			me.editor.destroy();
		}
		
		me.callParent( arguments );
	},
	
	checkChange: function()
	{
		var me = this;
		
		if( me.editor == null ||  !this.editor.dom ) {
			return me.callParent( arguments );
		}
		
		if( !me.suspendCheckChange && !me.isDestroyed && me.editor.isDirty() ) {
			var newVal = me.getValue(),
		        oldVal = me.lastValue;
			
        	me.lastValue = newVal;
        	me.fireEvent( 'change', me, newVal, oldVal );
        	me.onChange( newVal, oldVal );
		}
    },
	
	getValue : function()
	{
		return this.editor && this.editor.dom ?
				this.editor.getContent() :
				this.callParent( arguments );
	},
	
	setValue : function( value )
	{
		if( this.editor && this.editor.dom ) {
			this.editor.setContent( value || '' );
			this.editor.undoManager.clear();
			
			value = this.editor.getContent();
		}
		
		return this.callParent( arguments );
	},
	
	getSubmitData: function()
	{
		var me = this,
			data = {};
		
		data[ me.getName() ] = me.getValue();
		
		return data;
	},
	
	bindFocusListener : function()
	{
		var me = this;
		
		me.editor.focus();
		this.suspendCheckChange--;
		Ext.util.Observable.releaseCapture( this );
		this.checkChange();
	},
	
	unbindFocusListener : function()
	{		
		Ext.util.Observable.capture( this, function() { return false; } );
		this.suspendCheckChange++;
	}
	
}, function() {
	
	tinyMCE.init({
		accessibility_focus: false,
		mode	 : "none",
		skin	 : "o2k7",
		theme    : "advanced",
		theme_advanced_resizing: false
	});
});

Ext.define( 'extAdmin.widget.form.TinyMce.WindowManager',
{
	extend: tinymce.WindowManager,
	
	constructor : function( config )
	{
		tinymce.WindowManager.call( this, config.editor );
		
		Ext.apply( this, config );
	},
	
	alert : function( text, cb, s )
	{
		Ext.MessageBox.alert( '', text, function() {
			if( cb ) {
				cb.call( this );
			}
		}, s );
	},
	
	confirm : function( text, cb, s )
	{
		Ext.MessageBox.confirm( '', text, function( btn ) {
			if( cb ) {
				cb.call( this, btn == "yes" );
			}
		}, s );
	},
	
	open : function( s, p )
	{
		if( this.field ) {
			this.field.unbindFocusListener();
		}
		
		s = s || {};
		p = p || {};

		if(!s.type) {
			this.bookmark = this.editor.selection.getBookmark('simple');
		}

		s.width = parseInt(s.width || 320);
		s.height = parseInt(s.height || 240) + (tinymce.isIE ? 8 : 0);
		s.min_width = parseInt(s.min_width || 150);
		s.min_height = parseInt(s.min_height || 100);
		s.max_width = parseInt(s.max_width || 2000);
		s.max_height = parseInt(s.max_height || 2000);
		s.movable = true;
		s.resizable = true;
		p.mce_width = s.width;
		p.mce_height = s.height;
		p.mce_inline = true;

		this.features = s;
		this.params = p;

		var win = Ext.create("Ext.window.Window", {
			title: s.name,
			width: s.width,
			height: s.height,
			minWidth: s.min_width,
			minHeight: s.min_height,
			resizable: true,
			maximizable: s.maximizable,
			minimizable: s.minimizable,
			modal: true,
			stateful: false,
			constrain: true,
			layout: "fit",
			items: [
				Ext.create("Ext.Component", {
					autoEl: {
						tag: 'iframe',
						src: s.url || s.file
					},
					style : 'border-width: 0px;'
				})
			],
			listeners: {
				beforeclose: function() {
					if( this.field ) {
						this.field.bindFocusListener();
					}
				},
				scope: this
			}
		});

		p.mce_window_id = win.getId();

		win.show(null, function() {
			if (s.left && s.top)
				win.setPagePosition(s.left, s.top);
			var pos = win.getPosition();
			s.left = pos[0];
			s.top = pos[1];
			this.onOpen.dispatch(this, s, p);
		}, this);

		return win;
	},
	
	close : function( win )
	{
		if( win.tinyMCEPopup == null || win.tinyMCEPopup.id == null ) {
			tinymce.WindowManager.prototype.close.call( this, win );
			return;
		}

		var w = Ext.getCmp( win.tinyMCEPopup.id );
		if( w ) {
			this.onClose.dispatch( this );
			w.close();
		}
	},
	
	setTitle : function( win, title )
	{
		if( win.tinyMCEPopup == null || win.tinyMCEPopup.id == null ) {
			tinymce.WindowManager.prototype.setTitle.call( this, win, title );
			return;
		}

		var w = Ext.getCmp( win.tinyMCEPopup.id );
		if( w ) {
			w.setTitle( title );
		}
	},
	
	resizeBy : function( dw, dh, id )
	{
		var w = Ext.getCmp( id );
		if( w ) {
			var size = w.getSize();
			w.setSize( size.width + dw, size.height + dh );
		}
	},
	
	focus: function( id )
	{
		var w = Ext.getCmp( id );
		if( w ) {
			w.setActive( true );
		}
	}
});