Ext.define( 'extAdmin.widget.form.gridList.AbstractEditor',
{
	extend : 'Ext.util.Observable',
	
	/**
	 * Constructor
	 * 
	 * @constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		this.callParent( arguments );

		Ext.apply( this, {
			config       : config,
			originalForm : config.form,
			gridList     : config.gridList,
			newBtn       : null,
			fields       : {},
			actualRecord : null
		});
		
		var form = this.originalForm.getForm();
		for( var name in config.fields ) {
			var fieldConf = config.fields[ name ],
			    formField = form.findField( name );
			
			if( !formField ) {
				throw "["+ this.$className +"] Invalid form field '"+ fName +"'";
			}
			
			fieldConf.formField = formField;
			this.fields[ name ] = fieldConf;
		}
	},
	
	/**
	 * Sets fields values
	 * 
	 * @param {Ext.data.Record} record
	 */
	setRecord : function( record )
	{
		this.actualRecord = record;
		
		for( var fName in this.fields ) {
			var field     = this.fields[ fName ],
			    formField = field.formField;
			
			// disable fields with undefined data
			if( Ext.isDefined( record.data[ field.dataID ] ) == false ) {
				formField.disable();
				continue;
			} else {
				formField.enable();
			}

			// set readOnly
			var readOnly = field.readonly;

			if( Ext.isFunction( readOnly ) ) {
				readOnly = readOnly.call( record );
			}

			formField.setReadOnly( readOnly || false );

			// set field value
			formField.setValue( record.data[ field.dataID ] || null );

			if( this.originalForm.trackResetOnLoad ) {
				formField.originalValue = formField.getValue();
			}
			
			// set focus
			var autoFocus = field.autoFocus;
			
			if( Ext.isFunction( autoFocus ) ) {
				autoFocus = autoFocus.call( record );
			}
			
			if( autoFocus ) {
				formField.focus( false, 100 );
			}
		}
	},
	
	/**
	 * Submits record changes back to store
	 */
	submit : function()
	{
		if( !this.actualRecord ) {
			return;
		}
			
        for( var fName in this.fields ) {        	
			var field     = this.fields[ fName ],
			    formField = field.formField;
        	
        	this.actualRecord.set( field.dataID, formField.getValue() );
        }
        
        this.actualRecord.markDirty();
	},
	
	/**
	 * Reverts record changes and restores original values
	 */
	revert : function()
	{
		if( !this.actualRecord ) {
			return;
		}
			
		this.setRecord( this.actualRecord );
	},
	
	/**
	 * Adds new (empty) item
	 * 
	 * @param {Object} defaults
	 */
	addNew : function( defaults )
	{
		var data = {};
        for( var fName in this.fields ) {
			var field   = this.fields[ fName ],
			    initial = field.initial;        	    
        	
        	// fill initial value
        	if( Ext.isFunction( initial ) ) {
        		// TODO vymyslet smysluplny scope, pripadne parametry
        		data[ field.dataID ] = initial.call( this );
        	} else if( Ext.isDefined( initial ) ) {
        		data[ field.dataID ] = initial;
        	}
        }
		
        this.gridList.grid.getStore().loadData([ data ], true );
	}
});