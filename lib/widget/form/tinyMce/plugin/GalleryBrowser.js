Ext.define( 'extAdmin.widget.form.tinyMce.plugin.GalleryBrowser',
{
	texts : {
		title : 'Vložit obrázek z galerie'
	},
	
	requires : [
		'extAdmin.component.GalleryBrowser'
	],
	
	constructor : function(ed, url) {
		// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
		ed.addCommand( 'mceGalleryBrowser', function() {		    	
			/* lazy-create lookupForm */
			if( this.popup == null ) {
				this.popup = Ext.create( 'extAdmin.popup.Lookup', {
					closeAction    : 'hide',
					selectionMode  : 'single',
					selectionForce : false,
					
					panel : {
						ltype   : 'gallery',
						albumID : 1
					},
					
					onSelection : function( images ) {
						var content = '';
						
						for( var i = 0, rl = images.length; i < rl; ++i ) {
							var image = images[i];
							
							content += '<a class="cboxElement" href="'+ image.get('filename') +'" rel="lightbox[clanek]" title="">' +
								'<img width="'+ image.get('thumbWidth') +'" height="'+ image.get('thumbHeight') +'" src='+ image.get('thumbFilename') +' alt="'+ image.get('title') +'" title="'+ image.get('title') +'" />' +
								'</a>';
						}
						
//						ed.undoManager.add();
//						ed.insertContent( content, true );
						
						ed.execCommand( 'mceInsertContent', false, content );
					}
				});
			}
			
			this.popup.show();
		});

		// Register example button
		ed.addButton( 'galleryBrowser', {
			title : this.texts.title,
			cmd   : 'mceGalleryBrowser',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJSSURBVDjLpZM9aBRhEIaf2c3dJZvNxT+I0cJK0SJGwcKfwvIQFUsRG9HSKkGLKGhjKZGICViJ5RkQtLSQGOxsElEIFsKJCsZ4t7ls9u/b/cZCLxqTzoGBgRmeeV+YEVXlf6IL4MaDFyNVzzvVirUsIojgqyXsDIlY0iR+Pj5aG98UUPW9U1fO7N/qeb781fM7RZgaJqfnzgKbA5Yjyp7ny5OXC4Pfm1+2tDN1FLBFt1txeotyycUYsWNTswtpEtfHR2u31wFE6M2BlTDberF2oMvzqihKYS0uvlsuuSRp7hZodXJ67jywHqDKqip+Kyqku8fn6cxHd6m57ASxICKoreCI4DrOzszIwNjUbJAm8aPx0dpIV4ekCkWhbmZdgnbuXD59CM/r+9eyABKmpn9yeu4S8Bsg9FoLIIUjPW4QKp7Xx8LXNq8b1+mvLhFlhk+L2zm+6w5H9+9GxJU1C6giKFnxgzwPKaySA7m1+P4iPaVtWFJsucG3VoRVi4hW1wAO9psW2U6vvMPtLlVxHAdVWIkyWklCoauEJqUZJbRIQQVV2muAKEpeTNTnDxorQ2lqKGz8C5BYGl/3YivvCE1E0NrDvoHKxju4d612H+Dm1KvhSpfdDZVBayGIC4YHxjjcGOH9h08EJ++SmxwFROSPhU5EUfJsoj5/BJVzgvL281WMMbzJMrLBEtm78xhjuHDiDWsvpKob8sbkTGOpGehymGgQJhqEsbZW/uRis623Hr5uqep6BX8pqU/U549ZnCHHEQT6FZbpbBXLahg/BpD/feefqppLG2N7xVoAAAAASUVORK5CYII='
		});
	},

	/**
	 * Creates control instances based in the incomming name. This method is normally not
	 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
	 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
	 * method can be used to create those.
	 *
	 * @param {String} n Name of the control to create.
	 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
	 * @return {tinymce.ui.Control} New control instance or null if no control was created.
	 */
	createControl : function(n, cm) {
		return null;
	},

	/**
	 * Returns information about the plugin as a name/value array.
	 * The current keys are longname, author, authorurl, infourl and version.
	 *
	 * @return {Object} Name/value array containing information about the plugin.
	 */
	getInfo : function() {
		return {
			longname : 'Gallery browser plugin',
			author   : 'Inspirio s.r.o.',
			version  : "1.1"
		};
	}
	
}, function() {
	
	tinymce.PluginManager.add( 'galleryBrowser', extAdmin.widget.form.tinyMce.plugin.GalleryBrowser );
});