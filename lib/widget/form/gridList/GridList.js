Ext.define( 'extAdmin.widget.form.gridList.GridList',
{
	extend : 'Ext.form.field.Base',
	alias  : 'widget.listfield',
	
	requires : [
		'Ext.grid.Panel',
		'inspirio.Store',
		'extAdmin.popup.Lookup'
	],
	
	height : 200,
	
	fieldSubTpl : [ '' ],
	
	componentLayout : {
		type : 'field',
		
		sizeBodyContents : function( width, height )
		{
			var me = this.owner,
			    grid = me.grid;
			
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
		var me = this,
		    o = me.options || {};
			
		// map grid columns
		var columns = [];
		for( var i = 0, fl = o.fields.length; i < fl; ++i ) {
			var field = o.fields[i];
			
			if( field.title == null ) {
				continue;
			}
			
			columns.push({
				header    : field.title,
				dataIndex : field.name,
				width     : field.width,
				flex      : field.width == null,
				editor    : field.editor,
				xtype     : field.type,
				format    : field.format
			});
		};
	
		// insert actions column
		if( Ext.isArray( o.actions ) ) {			
			columns.push({
				xtype : 'actioncolumn',
				width : o.actions.length * 18 + 5,
				items : o.actions
			});
		}
		
		// map store fields
		var fields = [];
		for( var i = 0, fl = o.fields.length; i < fl; ++i ) {
			var field = o.fields[i];
			
			fields.push({
				name : field.name
			});
		};
		
        var model = Ext.define( me.$className +'.AnonymousModel-'+ Ext.id(), {
            extend : 'extAdmin.Model',
            fields : o.fields
        });
		
        me.grid = Ext.create( 'Ext.grid.Panel', {
			title  : o.title,
			height : me.height || o.height || 150,
			
			columns : columns,
			
			store : {
				model         : model,
				implicitModel : true,
				
				proxy : {
					type   : 'memory',				
					reader : {
						type : 'json',
						idProperty : 'ID'
					}
				},
				
				listeners : {
					datachanged : Ext.Function.bind( me.onChange, me )
				}
			}
		});
		
		me.callParent();
		
		// create/bind lookup popup
		if( o.itemsLookup ) {
			me.bindLookupPopup( o.itemsLookup );
		}
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
	
	
//	onRender : function()
//	{
//		this.callParent( arguments );
//		
//		this.form = this.up('form');
//		
//		var options = this.options;
//		
//		// bind with detail form
//		this.fieldsBind = null;
//		if( options.detailEdit ) {
//			Ext.apply( options.detailEdit, {
//				form     : this.form,
//				gridList : this
//			});
//			
//			var type = options.detailEdit.type || extAdmin.widget.form.gridList.rowEditor.Inline;
//			this.detailEditor = Ext.create( type, options.detailEdit );
//			
//			this.grid.getView().markDirty = false;
//		}
//	},
//	
	getValue : function()
	{
		return inspirio.Store.getDataToSubmit( this.grid.store ) || undefined;
	},
	
	getRawValue: function()
	{
		var me = this;
		
		return me.rawValue = me.getValue();
    },
	
//	getSubmitData : function() {
//		var me = this,
//		    data = null;
//	    
//		if ( !me.disabled && me.submitValue ) {
//			data = {};
//			data[me.getName()] = me.getValue();
//		}
//		
//		return data;
//	},
	
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
	
	/**
	 * Adds action column with 'remove' button to given grid
	 * 
	 * @param {Array}
	 */
	addActionButtons : function( button )
	{
		if( Ext.isArray( button ) ) {
			for( var i = 0, bl = button.length; i < bl; ++i ) {
				this.addActionButtons( button[i] );
			}
			
			return;
		}
		
		var colModel = this.getColumnModel();
		
		if( this.actionColumn ) {
			colModel.config.pop();
			
		} else {
			this.actionColumn = {
	        	xtype : 'actioncolumn',
	     	   	width : 50,
	     	   	items : []
			};
		}
		
		this.actionColumn.items.push( button );
		
		colModel.config.push( this.actionColumn );
		colModel.setConfig( colModel.config );
	},
	
	/**
	 * Creates data lookup popup and binds pop button
	 * 
	 * @param {Object}
	 */
	bindLookupPopup : function( lookupConf )
	{
		var onSelection,
		    grid  = this.grid,
		    store = grid.getStore();
		
		// create onSelection function
		if( lookupConf.popup.mapping ) {
			var mappings = lookupConf.popup.mapping;
			
			onSelection = function( items ) {
				var data = [];
				
				for( var i = 0, il = items.length; i < il; ++i ) {
					var record     = items[ i ],
					    recordData = record.data,
					    dataItem   = {};
					
					for( var localID in mappings ) {
						var columnMapping = mappings[ localID ];
						
						// direct string mapping
						if( Ext.isString( columnMapping ) ) {							
							dataItem[ localID ] = recordData[ columnMapping ];
						
						// columnMapping object
						} else if( Ext.isObject( columnMapping ) ) {
							if( Ext.isFunction( columnMapping.dataID ) ) {
								dataItem[ localID ] = columnMapping.dataID.apply( this, [ record ] );
								
							} else if( Ext.isString( columnMapping.dataID ) && recordData.hasOwnProperty( columnMapping.dataID ) ) {
								dataItem[ localID ] = recordData[ dataID ];
								
							} else if( Ext.isFunction( columnMapping.initial ) ) {
								dataItem[ localID ] = columnMapping.initial.apply( this, [ record ] );
								
							} else {
								dataItem[ localID ] = columnMapping.initial;
							}
						}
					}
				
					data.push( dataItem );
				}
				
				store.loadData( data, true );
			};
			
		} else {
			onSelection = store.add;
		}
		
		// apply default settings
		Ext.applyIf( lookupConf.popup, {
			closeAction : 'hide',
			onSelection : onSelection,
			scope       : store
		});
		
		// create & bind popup funciton
		if( lookupConf.button ) {
			var button = Ext.apply( {}, lookupConf.button, {
				listeners : {
					scope : this,
					click : function() {
						if( grid.itemsLookup == null ) {
							grid.itemsLookup = Ext.create( 'extAdmin.popup.Lookup', lookupConf.popup );
						}
						
						grid.itemsLookup.show();				
					}
				}
			});
			
			this.addButton( button );
		}
	},
	
	addButton : function( button )
	{		
		if( !this.buttonsBar ) {
			this.buttonsBar = Ext.create( 'Ext.toolbar.Toolbar', {
				dock : 'top'
			});
			
			this.grid.addDocked( this.buttonsBar );
		}
		
		this.buttonsBar.add( button );
	}
});