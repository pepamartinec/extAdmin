Ext.define( 'extAdmin.component.dataBrowser.view.Tree',
{
	extend : 'Ext.tree.Panel',
	mixins : {
		dataView : 'extAdmin.component.dataBrowser.DataViewFeature'
	},
	
	initComponent : function()
	{
		var me = this;
		
		me.configDataStore({
			type : 'Ext.data.TreeStore',
			
			defaultRootProperty : 'data',
			nodeParam : 'parentID',
			async : false,
			
			// disable root node autoLoad
		    root: {
		    	expanded : true,
		    	text     : '',
		    	data     : [],
		    	ID		 : '',
		    	allowDrop : false
		    }
		});
		me.configColumns();
		
		Ext.apply( me, {
//			useArrows        : true,
			rootVisible      : false,
			sortableColumns  : false
		});
		
		me.callParent( arguments );
		
		me.configActions( me.actions );
		
		// update active actions on items selection change
		me.getSelectionModel().on( 'selectionchange', me.updateActionsStates, me );
		me.updateActionsStates();
	},
	
	getActiveRecords : function()
	{
		return this.getSelectionModel().getSelection();
	},
	
	/**
	 * Records change notification callback
	 * 
	 * Should be called by actions when some records were changed
	 * 
	 * @param {Object} changes Changes list
	 * @param {Number[]} [changes.created] List of newly created record IDs
	 * @param {Number[]} [changes.updated] List of updated record IDs
	 * @param {Number[]} [changes.deleted] List of deleted record IDs
	 */
	notifyRecordsChange : function( changes )
	{return;
		var me = this,
		    toLoad   = [].concat( changes.created || [], changes.updated || [] ),
		    toRemove =  changes.deleted || [];
		
		if( toLoad.length > 0 ) {
			me.store.load({
				filters : [{
					property : 'ID',
					value    : toLoad
				}]
			});
		}
		
		console.log(changes);
		if( changes.updated ) {
			Ext.Array.forEach( changes.updated, function( updated ) {
				var data = updated;
				
				if( updated instanceof Ext.data.Model ) {
					data = updated.data;	
				}
				
				var node = me.store.getRootNode().findChild( 'ID', data.ID, true );
				console.log(node,data);
				if( node ) {
					node.set( data );
				}
			});
		}
	}
});