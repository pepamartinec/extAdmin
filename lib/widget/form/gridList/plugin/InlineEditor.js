Ext.define( 'extAdmin.widget.form.gridList.plugin.InlineEditor',
{
	extend : 'Ext.AbstractPlugin',
	alias  : 'plugin.gl_inlineeditor',
	
	uses : [
		'Ext.grid.plugin.CellEditing',
		'Ext.grid.plugin.RowEditing'
	],
	
	mixins: {
		observable: 'Ext.util.Observable'
	},
	
	/**
	 * Editor mode (cell|row)
	 * 
	 * @cfg {String} mode
	 */
	mode : 'cell',
	
	/**
	 * Editors configuration
	 * 
	 * @cfg {Object} editors
	 */
	editors : null,
	
	/**
	 * If true, editor is automatically activated, when new record is added
	 * 
	 * @cfg {Boolean} activateOnAdd
	 */
	activateOnAdd : true,
	
	/**
	 * First column with configured editor
	 * 
	 * @private
	 * @property {Integer} firstColumn
	 */
	firstColumn : null,
	
	/**
	 * 
	 * 
	 * @private
	 * @property {Boolean} isAdded
	 */
	isAdded : false,
	
	/**
	 * 
	 */
	editableCls : 'x-editable',
	
	/**
	 * Plugin constructor
	 * 
	 * @public
	 * @param config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		// init editorPlugin
		switch( me.mode ) {
			case 'cell': me.initCellEditor(); break;
			case 'row' : me.initRowEditor();  break;
			default    : Ext.Error.raise({
				msg      : 'Invalid GridList InlineEditor mode set',
				mode     : me.mode,
				gridList : me.cmp
			});
		}
		
		// init observable
		me.addEvents();
		me.relayEvents( me.editorPlugin, [ 'beforeedit', 'edit', 'validateedit' ] );
		me.mixins.observable.constructor.call( me );
		
		// inject link to gridList
		me.cmp.editor = me;
		
		// setup editors to columns
		var columns = me.cmp.columns,
		    column;
		
		for( var dataIdx in columns ) {
			column = columns[ dataIdx ];
			
			if( me.editors[ dataIdx ] ) {
				column.editor = me.editors[ dataIdx ];
				column.tdCls  = ( column.tdCls || '' )+ ' '+this.editableCls;
			}
		}
	},
	
	/**
	 * Initializes editorPlugin as CellEditor
	 * 
	 * @private
	 */
	initCellEditor : function()
	{
		var me = this;
		
		me.editorPlugin = Ext.create( 'Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			listeners    : {
				edit         : Ext.Function.bind( me.onEdit, me )
			}			
		});
		
		me.cmp.grid = Ext.Object.merge( me.cmp.grid || {}, {
			selType : 'cellmodel',
			plugins : [ me.editorPlugin ]
		});
	},
	
	/**
	 * Initializes editorPlugin as RowEditor
	 * 
	 * @private
	 */
	initRowEditor : function()
	{
		var me = this;
		
		me.editorPlugin = Ext.create( 'Ext.grid.plugin.RowEditing', {
			clicksToEdit : 1,
			listeners    : {
				edit : Ext.Function.bind( me.onEdit, me )
			}			
		});
		
		me.cmp.grid = Ext.Object.merge( me.cmp.grid || {}, {
			selType : 'rowmodel',
			plugins : [ me.editorPlugin ]
		});		
	},
	
	/**
	 * Plugin initialization
	 * 
	 * @public
	 * @param {extAdmin.widget.form.gridList.GridList} list
	 */
	init : function( list )
	{
		var me = this;
		
		me.grid = list.grid;
		
		// pick editors instances
		var cols = me.grid.headerCt.getGridColumns(),
		    col;
		
		me.editors = [];
		for( var i = 0, cl = cols.length; i < cl; ++i ) {
			col = cols[i];
			
			if( col.getEditor() ) {
				me.editors.push( cols[i] );
			}
		}
	},
	
	/**
	 * Displays editor at given position
	 * 
	 * @public
	 * @param {Ext.data.Model} record
	 * @param {Ext.grid.column.Column} columnHeader
	 */
	startEdit : function( record, columnHeader )
	{
		var me = this;
		
		if( record === undefined ) {
			record = me.grid.getStore().last();
		}
		
		if( columnHeader === undefined ) {
			columnHeader = me.editors[0];
		}
		
		me.editorPlugin.startEdit( record, columnHeader );
	},
	
	/**
	 * Cancels any active editor
	 * 
	 * @public
	 */
	cancelEdit : function()
	{
		this.editorPlugin.cancelEdit();
	},
	
	/**
	 * Submits any active editor
	 * 
	 * @public
	 */
	completeEdit : function()
	{
		this.editorPlugin.completeEdit();
	},
	
	/**
	 * Editor submit handler
	 *
	 * @private
	 * @param editor
	 * @param e
	 */
	onEdit : function( editor, e )
	{
		var me = this;
		
		me.cmp.checkDirty();
	}
});