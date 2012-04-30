Ext.define( 'extAdmin.widget.form.gridList.GridList',
{
	extend : 'Ext.form.field.Base',
	alias  : 'widget.listfield',
	
	requires : [
		'Ext.grid.Panel',
		'extAdmin.Store',
		'extAdmin.popup.Lookup'
	],
	
	uses : [
		'extAdmin.widget.form.gridList.plugin.InlineEditor',
		
		'extAdmin.widget.form.gridList.actionButton.AddEmpty',
		'extAdmin.widget.form.gridList.actionButton.AddLookup',
		'extAdmin.widget.form.gridList.actionButton.Remove'
	],
	
	height : 200,
	
	fieldSubTpl : [ '' ],
	
	componentLayout : {
		type : 'field',
		
		sizeBodyContents : function( width, height )
		{
			var grid = this.owner.grid;
			
			grid.setWidth( width );
			grid.setHeight( height );
		}
	},
	
	/**
	 * Component initialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		var grid = Ext.Object.merge({
			dockedItems : me.dockedItems || [],
			
		}, me.grid || {} );
		
		delete me.dockedItems;
		
		// setup bar actions
		if( me.barActions ) {
			var items = [];
			
			for( var action, i = 0, al = me.barActions.length; i < al; ++i ) {
				action = me.barActions[ i ];
				
				if( action instanceof Ext.Action === false && action.atype ) {
					action.list = me;					
					action = Ext.create( 'glaction.'+ action.atype, action );
				}
				
				items.push( action );
			}
			
			me.actionBar = Ext.create( 'Ext.toolbar.Toolbar', {
				dock  : 'top',
				items : items
			});
			
			grid.dockedItems.push( me.actionBar );
		}
		
		// create model
		
		var modelName = extAdmin.Model.createAnonymous( me, { fields : me.columns }),		
		    columns = Ext.ModelManager.getModel( modelName ).prototype.columns;
		
		// setup row actions
		if( me.rowActions ) {
			var items = [];
			
			for( var action, i = 0, al = me.rowActions.length; i < al; ++i ) {
				action = me.rowActions[ i ];
				
				if( action instanceof Ext.Action === false && action.atype ) {
					action.list = me;					
					action = Ext.create( 'glaction.'+ action.atype, action );
				}
				
				items.push( action );
			}
			
			me.actionColumn = Ext.create( 'Ext.grid.column.Action', {
				width : items.length * 18 + 10,
				items : items
			});
			
			columns.push( me.actionColumn );
		}
		
		// init self
		me.grid = Ext.create( 'Ext.grid.Panel', Ext.apply( grid, {			
			columns : columns,
			store   : {
				model         : modelName,
				implicitModel : true,
				
				proxy : {
					type   : 'memory',				
					reader : {
						type : 'json',
						idProperty : 'ID'
					}
				}
			}
		}));
		
		me.grid.addCls( 'x-gridlist' );
		
		me.callParent( arguments );
		
		me.relayEvents( me.grid.store, [
			'itemadd',
			'itemupdate',
			'itemremove'
		],  'item' );
		
		me.relayEvents( me.grid.store, [
   			'datachanged'
   		]);
	},
	
	onRender : function()
	{
		var me = this;
		
		me.callParent( arguments );
		me.grid.render( me.bodyEl );
	},
	
	getStore : function()
	{
		return this.grid.store;
	},

    
    resetOriginalValue: function() {
        this.originalValue = this.getValue();
        this.checkDirty();
    },

    
    isDirty : function()
    {
        var me = this,
            store = me.grid.store;

        return store.getNewRecords().length > 0 ||
               store.getUpdatedRecords().length > 0 ||
               store.getRemovedRecords().length > 0;
    },
	
	getValue : function()
	{
		return extAdmin.Store.getDataToSubmit( this.grid.store ) || undefined;
	},
	
	getRawValue: function()
	{
		var me = this;
		
		return me.rawValue = me.getValue();
    },
	
	setValue : function( value )
	{	
		var store = this.grid.store;
		
		store.loadData( value || {} );
		store.removed = [];
		
		this.checkChange();
		return this;
	},
	
	getCount : function()
	{
		return this.grid.store.getCount();
	},
	
	setReadOnly : function( readOnly )
	{
		var me = this;
		
		me.actionBar[ readOnly ? 'hide' : 'show' ]();
		
		if( readOnly ) {
			me.actionColumn.hide();
			me.actionColumn.hideable = false;
			
		} else {
			me.actionColumn.show();
			me.actionColumn.hideable = true;
		}
		
		me.callParent( arguments );
	}
});