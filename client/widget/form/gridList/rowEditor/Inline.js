Ext.define( 'extAdmin.widget.form.gridList.rowEditor.Inline',
{
	extend : 'extAdmin.widget.form.gridList.AbstractEditor',

	/**
	 * Constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		// default configuration
		Ext.applyIf( config, {
			fieldName  : null,
			autoSubmit : true
		});
		
		this.callParent( arguments );
		
		// bind grid row selection
		this.gridList.grid.getSelectionModel().on( 'selectionchange', this.onGridSelectionChange, this );
		
		// bind save event
		this.gridList.on( 'beforevaluesget', this.beforeFormSubmit, this );
		this.gridList.on( 'valuesget',       this.afterFormSubmit,  this );
		
		// bind autoSave
		if( config.autoSubmit ) {
	        for( var fName in this.fields ) {
	        	this.fields[ fName ].formField.on( 'change', this.onFieldChange, this );
	        }
		}
		
		// bind newItem button
		if( config.newBtn ) {
			config.newBtn.on( 'click', this.addNew, this );
		}
		
		this.disableForm();
	},
	
	/**
	 * Destructor
	 */
	destroy : function()
	{
		this.form.getSelectionModel().un( 'selectionchange', this.onGridSelectionChange );
		this.gridList.un( 'beforevaluesget', this.beforeFormSubmit );
		this.gridList.un( 'valuesget',       this.afterFormSubmit );
		
		for( var fName in this.fields ) {
        	this.fields[ fName ].formField.un( 'change', this.onFieldChange );
		}
		
		Ext.LH.cms.FormPopup.superclass.destroy.call( this, arguments );
	},
	
	/**
	 * 
	 */
	beforeFormSubmit : function()
	{
		if( this.config.autoSubmit ) {
			this.submit();
		}
		
		this.disableForm();
	},
	
	/**
	 * 
	 */
	afterFormSubmit : function()
	{
		var record = this.gridList.grid.getSelectionModel().getSelected();
		
		if( record ) {
			this.setRecord( record );
		}
	},
	
	/**
	 * Disables form for any editing
	 */
	disableForm : function()
	{
		this.actualRecord = null;
		
        for( var fName in this.fields ) {
        	var field = this.fields[ fName ].formField;
        	
        	field.setValue();
        	field.setDisabled( true );
        }
	},
	
	/**
	 * Changes form content on grid row selection
	 * 
	 * @private
	 * 
	 * @param {Ext.grid.RowSelectionModel} selModel
	 */
	onGridSelectionChange : function( selModel )
	{		
		// submit changes
		if( this.actualRecord && this.config.autoSubmit ) {
			this.submit();
		}
		
		// load new record
		var record = selModel.getSelected();
		
		if( record ) {
			this.setRecord( record );
			
		} else {
			this.disableForm();
		}
	},
	
	/**
	 * Changes record data on form field value change
	 * 
	 * @private
	 * 
	 * @param {Ext.form.Field} field
	 * @param {} newValue
	 * @param {} oldValue
	 */
	onFieldChange : function( field, newValue, oldValue )
	{
		var fieldDef = this.fields[ field.getName() ];
		
		if( this.actualRecord ) {
			this.actualRecord.set( fieldDef.dataID, newValue );
		}
	},
	
	/**
	 * Adds new (empty) item
	 * 
	 * @param {Object} defaults
	 */
	addNew : function()
	{
		this.callParent( arguments );
		
        this.gridList.grid.getSelectionModel().selectLastRow();
	}
});