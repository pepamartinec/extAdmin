Ext.define( 'extAdmin.widget.form.gridList.rowEditor.Popup',
{
	extend : 'extAdmin.widget.form.gridList.AbstractEditor',

	texts : {
		submitBtn  : 'Uložit',
		cancelBtn  : 'Storno'
	},
	
	/**
	 * Constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{		
		this.callParent( arguments );
		
		// create form
		var formFields = [];
		for( var name in this.fields ) {
			formFields.push( this.fields[ name ].formField );
		}

		this.form = new Ext.form.FormPanel({
			width   : 500,//config.formPanel.getInnerWidth(),
			padding : 5,
			items   : formFields			
		});
		
		// create window
		this.popup = new Ext.Window({
			y : 20,
			titleCollapse : this.title == null,
			title       : this.title,
			autoHeight  : true,
			autoWidth   : true,
			movable     : false,
			resizable   : false,
			closable    : true,
			closeAction : 'hide',
			modal       : true,
			items       : [ this.form ],
			buttons     : [{
				text    : this.texts.submitBtn,
				iconCls : 'i-accept',
				scope   : this,
				handler : this.onSaveButtonClick
			},{
				text    : this.texts.cancelBtn,
				iconCls : 'i-cancel',
				scope   : this,
				handler : this.onCancelButtonClick
			}]
		});
		
		// add edit button
//		this.gridList.addActionButton(
//			new Ext.LH.Form.ActionColumn.buttons.Edit( this.onEditButtonClick, this )
//		);
		
		// bind newItem button
		if( config.newBtn ) {
			config.newBtn.on( 'click', function() { this.addNew(); }, this );
		}
	},
	
	onEditButtonClick : function( grid, rowIndex )
	{
		var record = grid.getStore().getAt( rowIndex );
		
		this.setRecord( record );
		this.popup.show();
		this.popup.syncSize();
	},
	
	onSaveButtonClick : function()
	{
		this.submit();
		this.popup.hide();
	},
	
	onCancelButtonClick : function()
	{
		this.popup.hide();
	},

	
	/**
	 * Adds new (empty) item
	 * 
	 * @param {Object} defaults
	 */
	addNew : function( defaults )
	{
		this.callParent( arguments );
		
        this.gridList.grid.getSelectionModel().selectLastRow();
	}
});