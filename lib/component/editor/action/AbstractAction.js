Ext.define( 'extAdmin.component.editor.action.AbstractAction',
{		
	extend : 'extAdmin.action.AbstractAction',
	
	isPrototype : true,
	category    : 'edit',
	
	/**
	 * @required
	 * @config {extAdmin.editor.DataEditorFeature} editor
	 */
	editor : null,
	
	/**
	 * Constructor
	 * 
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.editor = config.editor;
		
		me.callParent( arguments );
	},
	
	/**
	 * Returns parameters for handler function
	 * 
	 * @protected
	 * @returns {Array}
	 */
	getHandlerParams : function()
	{
		return [ this.editor.getData() ];
	}
});
