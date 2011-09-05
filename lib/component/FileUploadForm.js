Ext.define( 'extAdmin.component.FileUploadForm',
{
	extend : 'Ext.form.Panel',
	
	texts : {
		fieldPrefix  : 'Soubor ',
		fieldSuffix  : '',
		browseBtn    : 'Procházet...',
		expandBtn    : 'Přidat další',
		submitBtn    : 'Nahrát',
		uploadingMsg : 'Nahrávám...'
	},
	
	/**
	 * Module
	 * 
	 * @cfg {extAdmin.Module|Null} module
	 */
	module : 'repository',
	
	/**
	 * Upload action name
	 * 
	 * @cfg {String|Null} submitAction
	 */
	submitAction : 'uploadFiles',
	
	/**
	 * Files submit parameters
	 * 
	 * @cfg {Object|Null} submitParams
	 * @property {Object|Null} submitParams
	 */
	submitParams : null,
	
	/**
	 * Name attribute of file upload fields
	 * 
	 * @cfg {String}
	 */
	fieldsName : 'files',
	
	/**
	 * Whether display auto-expand button
	 * 
	 * @cfg {Boolean}
	 */
	expandButton : false,
	
	/**
	 * Wheter auto-add new file-field, when the last one is filled
	 * 
	 * @cfg {Boolean}
	 */
	autoExpand : true,
	
	/**
	 * Initial number of fields
	 * 
	 * @cfg {Number}
	 */
	fieldsNo : 5,
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		// setup events
		me.addEvents( 'beforesubmit', 'submit' );
		
		// apply default module config
		me.module = extAdmin.ModuleManager.get( me.module || me.self.defaultModule );
		me.submitAction = me.submitAction || me.self.defaultAction;
		me.submitParams = me.submitParams || {};
		
		// set minimum fields count
		if( me.fieldsNo < 1 ) {
			me.fieldsNo = 1;
		}
		
		// expand button
		if( me.expandButton ) {
			me.expandBtn = new Ext.Button({
				text    : me.texts.expandBtn,
				handler : Ext.Function.bind( me.addFields, me, [ 1 ] )
			});
		}
		
		Ext.apply( me, {
			bodyPadding : 5,
	        defaults: {
	            anchor: '100%'
	        },
	        fieldDefaults: {
	            msgTarget: 'side'
	        },
			items : [],
			buttons : [{
				type    : 'submit',
				text    : me.texts.submitBtn,
				scope   : me,
				handler : me.submit
			}]
		});
		
		me.callParent();
		
		me.addFields( me.fieldsNo );
	},
	
	/**
	 * Submits filled data
	 * 
	 * @public
	 * @async
	 */
	submit : function()
	{
		var me = this;
		
		if( me.fireEvent( 'beforesubmit', me.form ) ) {
			me.getForm().submit({
				url     : me.module.buildUrl({ action : me.submitAction }),
				params  : me.submitParams,
	    		waitMsg : me.texts.uploadingMsg,
	    		success : me.onSubmitSuccess,
	    		scope   : me
	    	});
		}
	},
	
	/**
	 * Handler for submit-request response
	 * 
	 * @private
	 * @param form
	 * @param action
	 */
	onSubmitSuccess : function( form, action )
	{
		var me = this,
		    uploaded = [],
		    stats    = action.result.status;
		
		// convert array to object
		// stats are sometimes interpreted as object and sometimes as array
		if( Ext.isArray( stats ) ) {
			var tmpStats = {};
			for( var i = 0, sl = stats.length; i < sl; ++i ) {
				tmpStats[i] = stats[i];
			}
			
			stats = tmpStats;
		}
		
		var success = true;
		for( var idx in stats ) {
			idx = parseInt( idx );
			
			var field = me.items.get( idx );
			if( field instanceof Ext.form.field.File === false ) {
				continue;
			}
			
			if( status.status == true ) {
				uploaded.push( status.data );		

				field.fileInputEl.dom.value = null;
				field.onFileChange();
				
				//field.reset();
				
			} else {
				field.markInvalid( status.message );
				success = false;
			}
		}
		
		this.fireEvent( 'submit', success, uploaded );
	},
	
	/**
	 * Replace for {@link Ext.form.field.File.extractFileInput} method.
	 * Standard method causes field value reset on every submit.
	 * 
	 * @private
	 */
	_extractFileInput : function()
	{
		return this.fileInputEl.dom.cloneNode( true );
	},
	
	/**
	 * Appends more file-input fields
	 * 
	 * @public
	 * @param size number of fields to append
	 */
	addFields : function( size )
	{
		var texts    = this.texts,
		    fieldsNo = this.items.length,
		    fuField  = null;
		
		// add new fields
		size = Math.max( size || 1, 1 );
		
		var fields = [];
		for( var i = 0; i < size; ++i ) {
			fuField = Ext.create( 'Ext.form.field.File', {
				fieldLabel : texts.fieldPrefix + ( fieldsNo + i ) + texts.fieldSuffix,
				buttonText : texts.browseBtn,
				name       : 'files[]',
				
				extractFileInput : this._extractFileInput
			});
			
			fields.push( fuField );
		}
		
		this.add( fields );
		
		// bind auto-expand
		if( this.autoExpand || true ) {
			var fields = this.items,
			    callback = function() { this.addFields( 1 ); };
			
			if( fields.length > 0 ) {
				fields.get( fields.length - 1 ).un( 'change', callback );
			}
			
			fuField.on( 'change', callback, this );
		}
	}
});