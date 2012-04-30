Ext.define( 'extAdmin.widget.form.CheckboxList',
{
	extend : 'Ext.form.field.Base',
	alias  : 'widget.checkboxlist',
	
	requires : [
	     'Ext.grid.Panel'
	],
	
	fieldSubTpl 		: [ '' ],
	
	height 				: 200,
	storeLoaded			: false,
	
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
	    	 
	    me.value			= [];
	    me.originalValue 	= [];
	    	 
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
	 			format    : field.format,
	 			hidden	  : field.hidden
	 		});
	 	};
	 	
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
		
			selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' }),
			
			store : {
				model         : model,
				implicitModel : true,
				autoLoad 	  : false,
				
				proxy : {
					type : 'ajax',
					url  : o.module.buildUrl({
						request : 'form',
						name    : 'editForm',
						action  : o.fetchAction
					}),
					
					actionMethods: {
						read    : 'POST',
						create  : 'POST',
						update  : 'POST',
						destroy : 'POST'
					},

					reader : {
						idProperty      : 'ID',
						messageProperty : 'message',
						successProperty : 'success',
						totalProperty   : 'total',
						root            : 'data'
					}
				},
				
				listeners : {
					// datachanged : Ext.Function.bind( me.onChange, me ),
					// after store load, set originalValue to current value and reset field (to tick selected records)
					beforeLoad	: function() {
						// do not update value (onSelectionChange), because 
						me.grid.getSelectionModel().suspendEvents( false );
					},
					load		: function() {
						me.storeLoaded = true;
						me.tickSelected();
						me.resetOriginalValue();
						me.grid.getSelectionModel().resumeEvents();
					}
				}
			},
			listeners : {
				// check if field is dirty on any selection change
				selectionchange: Ext.Function.bind( me.onSelectionChange, me )
			}
		});
		
		me.callParent();
		
		// load data for checkbox list from server, after form is filled with values
		me.upDelayed( 'form', function( form ) {
			me.form = form;
			me.form.on( 'actioncomplete', me.refreshStore, me );
		});
	},
	
	/**
	 * refresh store
	 */
	refreshStore : function()
	{
		var me = this,
		    store = me.getStore();
	
		store.load({
			params   : me.form.getValues()
		});
	},
	
	onRender : function()
	{
		var me = this;
		
		me.callParent( arguments );
		me.grid.render( me.bodyEl );
	},
	
	/**
	 * get checkboxlist store
	 * 
	 * @return {Ext.data.Store}
	 */
	getStore : function()
	{
		return this.grid.store;
	},
    
	/**
	 * Tick selected records (only if store is loaded (= chexboxlist is filled) and value is set)
	 */
	tickSelected: function()
	{
		if( this.storeLoaded && Ext.isArray( this.value ) && this.value.length > 0  ) 
		{
			var store 		= this.getStore();
			var items 		= store.getRange();
			var selected 	= [];
	
			for( var i in items ) {
				if( this.value.indexOf( items[i].get('ID') ) >= 0 ) {
					selected.push( items[i] );
				}
			}
				
			// select recods
			this.grid.getSelectionModel().select( selected );
		}
		else if( this.storeLoaded )
		{
			// deselect all
			this.grid.getSelectionModel().deselectAll();
		}
	},
	
	onSelectionChange: function()
	{
		var me 		= this;
		var value 	= [];
		
		// get an array of selected records
		var selectedRecords = me.grid.getSelectionModel().getSelection(); 
		
		Ext.iterate( selectedRecords, function(record, index)  
		{
			value.push( record.get('ID') ); 
		});
		
		// set value by selected rows
		me.value = value;
		
		// check dirty
		me.checkDirty();
	},
 
/***************** GET/SET Values *******************************/   

	/**
	 * get value = array of IDs of selected records
	 * @return array of int
	 */
	getValue : function()
	{
		return this.value;
	},
	
	/**
	 * get row value = value
	 * @return array of int
	 */
	getRawValue: function()
	{
		var me = this;
		return me.rawValue = me.getValue();
    },

    /**
     * submit value format: { added: [], removed: [] }
     * @return object
     */
    getSubmitValue: function()
    {
    	var me 		= this;
    	var value 	=  me.getValue();
    	
    	// at start, is expected all defaultly selected items were removed
		var removedIDs = (Ext.isArray(me.originalValue))? me.originalValue.slice() : [];
		// at start, is expected none item is selected
		var selectedIDs 	= [];
		
		var indexInOriginal = null;
		for( var i in value )
		{
			indexInOriginal = removedIDs.indexOf( value[i] );
			// record was defaultly checked
			if( indexInOriginal >= 0 ) {
				// remove it from removedIDs, because is still selected
				removedIDs.splice( indexInOriginal, 1 );
			}
			else {
				// push the ID into selectedIDs
				selectedIDs.push( value[i] ); 
			}
		}
	
		return { added: selectedIDs, removed: removedIDs };
    },

    /**
     * Sets a data value into the field and runs the change detection and validation.
     * Tick selected records in checkbox list after setting value
     * 
     * @param {Object} value The value to set
     * @return {Ext.form.field.Field} this
     */
	setValue : function( value )
	{	
		var me = this;
		me.value = value;
		
		// tick selected rows (no need to trigger selectionChange, because value vas already set in line above)
		me.grid.getSelectionModel().suspendEvents( false );
		me.tickSelected();
		me.grid.getSelectionModel().resumeEvents();
		
        return me;
	},
	
	/**
	 * Check if checkboxlist field is dirty ( at least one of the records wes ticked or unticked)
	 * @return boolean
	 */
    isDirty : function()
    {
       var value 			= ( Ext.isArray( this.value ) )? this.value : [];
       var originalValue	= ( Ext.isArray( this.originalValue ) )? this.originalValue : [];
       var dirty = true;
       if( originalValue.length == value.length && Ext.Array.difference( value, originalValue ).length == 0 ) {
    	   dirty = false;
       }

       return dirty;
    }
	
});