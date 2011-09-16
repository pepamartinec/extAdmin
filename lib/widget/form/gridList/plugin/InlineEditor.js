Ext.define( 'extAdmin.widget.form.gridList.plugin.InlineEditor',
{
	extend : 'Ext.AbstractPlugin',
	alias  : 'plugin.gl_inlineeditor',
	
	requires : [
		'Ext.grid.plugin.CellEditing'
	],
	
	/**
	 * Editors configuration
	 * 
	 * @cfg {Object} editors
	 */
	editors : null,
	
	/**
	 * If true, editor jumps to last record, when new record is added into the store
	 * 
	 * @cfg {Boolean} jumpOnRecordAdd
	 */
	jumpOnRecordAdd : true,
	
	/**
	 * First column with configured editor
	 * 
	 * @private
	 * @property {Integer} firstColumn
	 */
	firstColumn : null,
	
	/**
	 * @private
	 * @property {Boolean} isAdded
	 */
	isAdded : false,
	
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
		
		me.editorPlugin = Ext.create( 'Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			listeners    : {
//				validateedit : Ext.Function.bind( me.onValidateEdit, me ),
				edit         : Ext.Function.bind( me.onEdit, me )
			}			
		});
		
		me.cmp.grid = Ext.Object.merge( me.cmp.grid || {}, {
			selType : 'cellmodel',
			plugins : [ me.editorPlugin ]
		});
		
		var fields = me.cmp.options.fields;
		me.firstColumn = fields.length;
		
		for( var field, i = 0, fl = fields.length; i < fl; ++i ) {
			field = fields[i];
			
			if( me.editors[ field.name ] ) {
				field.editor = me.editors[ field.name ];
				
				if( i < me.firstColumn ) {
					me.firstColumn = i;
				}
			}
		}
	},
	
	/**
	 * Plugin initialization
	 * 
	 * @param {extAdmin.widget.form.gridList.GridList} list
	 */
	init : function( list )
	{
		var me = this;
		
		me.grid = list.grid;
		
		var store = me.grid.getStore();
		store.on( 'datachanged', me.onStoreDataChange, me );
		store.data.on( 'add', me.onDataAdd, me );
	},
	
	onValidateEdit : function( editor, e )
	{
		if( e.value == e.originalValue ) {
			e.cancel = true;
		}
	},
	
	onEdit : function( editor, e )
	{
		var me = this;
		
		me.cmp.checkDirty();
	},
	
	onDataAdd : function( idx, record )
	{
		var me = this;
		
		me.isAdded = true;
	},
	
	onStoreDataChange : function( store, records )
	{
		var me = this;
		
		if( me.jumpOnRecordAdd && me.isAdded ) {
			me.isAdded = false;
		
			Ext.Function.defer( function() {
				me.editorPlugin.startEditByPosition({
					row    : store.getCount() - 1,
					column : me.firstColumn
				});
			}, 50 );		
		}		
	}
});