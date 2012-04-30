Ext.define( 'extAdmin.widget.form.Image',
{
	extend : 'Ext.form.field.Base',

	alias : 'widget.imagefield',

	requires : [
		'Ext.XTemplate',
		'Ext.Error',
		'extAdmin.popup.Lookup'
	],

	texts : {
		chooseBtn : 'Vybrat',
		removeBtn : 'Zrušit',
		onError   : 'Vybraný obrázek se nepodařilo nahrát'
	},

	/**
	 * @required
	 * @cfg {extAdmin.Environment} env,
	 */
	env : null,

	/**
	 * @required
	 * @cfg {Mixed} loadAction
	 */
	loadAction : null,

	/**
	 * ParentID filter used in the image selector popup
	 *
	 * @required
	 * @cfg {Number}
	 */
	parentId : null,

	/**
	 * Field template
	 *
	 * @protected
	 * @param {Array} fieldSubTpl
	 */
	fieldSubTpl : [
		'<div id="{id}" class="{fieldCls} x-form-field-image"></div>',
		{
			compiled : true,
			disableFormats : true
		}
	],

	/**
	 * Render callback
	 *
	 * @protected
	 */
	onRender : function()
	{
		var me = this;

		me.callParent( arguments );

		me.form = me.up( 'form' );

		// create image element
		me.imgEl = Ext.core.DomHelper.append( me.inputEl, {
			tag : 'img',
			src : Ext.BLANK_IMAGE_URL
		}, true );

		me.imgEl.on( 'error', function() {
			if( me.getRawValue() != null ) {
				me.markInvalid( me.texts.onError );
			}

			me.imgEl.hide();

			if( me.ownerCt ) {
				me.ownerCt.doLayout();
			}
		} );

		me.imgEl.on( 'load', function() {
			me.clearInvalid();
			me.imgEl.show();

			if( me.ownerCt ) {
				me.ownerCt.doLayout();
			}
		} );

		me.imgEl.on( 'click', function() {
			me.popImageSelector();
		} );

		// create buttons
		me.removeBtn = null;
		if( me.required != true ) {
			me.removeBtn = Ext.create( 'Ext.button.Button', {
				text     : me.texts.removeBtn,
				cls      : Ext.baseCSSPrefix + 'remove-btn',
				renderTo : me.inputEl,

				scope   : me,
				handler : function() {
					me.setRawValue( null );
				}
			});
		}

		me.chooseBtn = Ext.create( 'Ext.button.Button', {
			text     : me.texts.chooseBtn,
			cls      : Ext.baseCSSPrefix + 'choose-btn',
			renderTo : me.inputEl,

			scope   : me,
			handler : me.popImageSelector
		});

		// init image
		me.setRawValue( me.getRawValue() );
	},

	/**
	 * Raw value setter
	 *
	 * @param {Mixed} value
	 */
	setRawValue : function( value )
	{
		var me = this;
		    value = Ext.value( value, null );

		me.rawValue = value;

		if( me.imgEl ) {
			if( value ) {
				var module = me.loadAction[0],
				    action = me.loadAction[1],
				    params = me.loadAction[2];

				Ext.apply( params, {
					imageID : value,
					variant : 'thumb'
				});

				me.imgEl.set({
					src : this.env.getActionUrl( module, action, params )
				});

			} else {
				me.imgEl.set({
					src : Ext.BLANK_IMAGE_URL
				});
			}
		}

		me.checkChange();

		return value;
	},

	/**
	 * Raw value getter
	 *
	 * @return {Mixed}
	 */
	getRawValue : function()
	{
		return this.rawValue;
	},

	/**
	 * Pops image selector
	 *
	 */
	popImageSelector : function()
	{
		var me = this,
		    form = me.form.getForm();

		if( form.isDirty() || me.albumIdField.getValue() == null ) {
			form.submit({
				silent  : true,

				scope   : me,
				success : me.popImageSelecter_onSubmit
			});

		} else {
			me.popImageSelecter_onSubmit();
		}
	},

	/**
	 * Pops image selector, second phase
	 *
	 * @private
	 */
	popImageSelecter_onSubmit : function()
	{
		var me = this;

		if( me.popup == null ) {
			me.popup = Ext.create( 'extAdmin.popup.Lookup', {
				closeAction    : 'hide',
				selectionMode  : 'single',
				selectionForce : false,

				panel : {
					ltype   : 'gallery',
					albumID : me.albumIdField.getValue()
				},

				onSelection : function( selection ) {
					if( selection.length == 0 ) {
						me.setRawValue( null );

					} else if( selection.length == 1 ) {
						me.setRawValue( selection[0].getId() );

					} else {
						Ext.Error.raise('Image field accept exactly one image from lookup,'+selection.length+' given');
					}
				}
			});
		}

		me.popup.show();
	}
});