Ext.define( 'extAdmin.component.dataList.Tree',
{
	extend : 'extAdmin.widget.Tree',
	
	requires : [
		'Ext.tree.plugin.TreeViewDragDrop'
	],
	
	/**
	 * Module
	 * 
	 * @required
	 * @cfg {extAdmin.Module} module
	 */
	module : null,
	
	/**
	 * @protected
	 * @property {String} moveAction
	 */
	moveAction : null,
	
	/**
	 * Returns module default config
	 * 
	 * @return {Object}
	 */
	getDefaultConfig : function()
	{			
		return {
			tree : {
				columns    : [],
				barActions : [],
				rowActions : [],
				
				enableDragDrop : true,
				moveAction     : 'updateRecordPosition'
			}
		};
	},
	
	/**
	 * Initializes component
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this,
		    config = extAdmin.component.DataList.pickServerConfig( me.module, me.getDefaultConfig() ).tree;
		
		// setup drag&drop
		if( config.enableDragDrop ) {
			Ext.apply( me, {
				viewConfig : {
					plugins: { ptype: 'treeviewdragdrop' }
				},

				listeners : {
					scope          : me,
					beforeitemmove : me.onNodeMove
				}
			});
			
			me.moveAction = config.moveAction;
		}
		
		Ext.Object.merge( me, {
			columns    : config.columns,
			rowActions : config.rowActions,
			barActions : config.barActions,
			
			multiSelect : true
		});
		
		me.callParent();
	},
	
	/**
	 * Node move callback
	 * 
	 * @private
	 * @param node
	 * @param oldParent
	 * @param newParent
	 * @param index
	 */
	onNodeMove : function( node, oldParent, newParent, newIndex )
	{
		var me = this;
		
		if( me.moveAction === null || newParent.getId() == null ) {
			return false;
		}
		
		me.setLoading( true );
		
		me.module.request.send({
			params : {
				action : me.moveAction
			},
			
			data : {
				recordID : node.getId(),
				parentID : newParent.getId(),
				position : newIndex
			},
			
			complete : function( response )
			{				
				if( response.success == true ) {
					me.un( 'beforeitemmove', me.onNodeMove );
					newParent.insertChild( newIndex, node );
					me.on( 'beforeitemmove', me.onNodeMove, me );
					
				}
				
				me.setLoading( false );
			}
		});
		
		return false;
	}
});