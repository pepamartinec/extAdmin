Ext.define( 'extAdmin.component.dataBrowser.actionDock.Column',
{
	extend : 'Ext.grid.column.Column',
	alias  : 'widget.dynamicactioncolumn',

	texts : {
		header  : 'Akce',
		altText : ''
	},
	
	/**
	 * @cfg {extAdmin.component.dataBrowser.DataBrowserFeature} dataView
	 */
	dataView : null,
	
	/**
	 * @cfg {Ext.data.AbstractStore} dataStore
	 */
	dataStore : null,
	
	/**
	 * @cfg {Array/Null} allowedActions
	 */
	allowedActions : undefined,
	
	/**
	 * @private
	 */
	actionIdRe: /x-action-col-name-(\S+)/,
	
	/**
	 * @private
	 */
	iconWidth : 20,
	
	/**
	 * Constructor
	 * 
	 * @param {Object} config
	 */
	constructor: function( config )
	{
		var me = this;
		
		Ext.apply( config, {
			header  : me.texts.header,
			altText : me.texts.altText,
			
			sortable	 : false,
			groupable	 : false,
			menuDisabled : true,
			resizable    : false,
			
			align : 'right',
			flex  : false,
			width : me.iconWidth,
			
			renderer : function( rowActions, meta ) {
				if( rowActions == null || rowActions.length === 0 ) {
					return;
				}
				
				// filter masked actions
				if( me.allowedActions ) {
					
				}
				
				// mark action cell
				meta.tdCls += ' '+ Ext.baseCSSPrefix + 'action-col-cell';
				
				// build cel HTML code
				var icons = [],
					actionName, action;
				
				for( var i = 0, al = rowActions.length; i < al; ++i ) {
					actionName = rowActions[ i ];
					action     = me.dataView.getAction( actionName );
					
					if( action == null ) {
						continue;
					}
					
					if( me.allowedActions && Ext.Array.contains( me.allowedActions, actionName ) === false ) {
						continue;
					}
					
					icons.push(
						'<img '+
							'alt="'+ action.getText() +'" '+
							'data-qtip="'+ action.getText() +'" '+
							'src="'+ Ext.BLANK_IMAGE_URL +'" '+
							'class="'+ Ext.baseCSSPrefix +'action-col-icon '+ Ext.baseCSSPrefix +'action-col-name-'+ action.name +' '+  (action.getIconCls() || '') +'" '+
						'/>' );
				}
				
				return icons.join('');
			}
		} );
		
		me.callParent( arguments );
	},
	
	/**
	 * Bind column width adjusting
	 * 
	 */
	onRender : function()
	{
		var me = this;
		
		me.callParent( arguments );		
		
		me.dataStore.on( 'datachanged', me.onRecordsRefresh, me );
		me.onRecordsRefresh( me.dataStore, me.dataStore.getRange() );
	},
	
	/**
	 * Ajust column width according to current needs
	 * 
	 * @param store
	 * @param newRecords
	 */
	onRecordsRefresh : function( store, newRecords )
	{
		var me = this;
		    maxActions = 0;
		
		Ext.Array.forEach( newRecords, function( record ) {
			var actions = record.get( me.dataIndex ),
			    length  = actions.length || 0;
			
			if( length > maxActions ) {
				maxActions = length;
			}
		});
		
		if( me.allowedActions ) {
			maxActions = Math.min( me.allowedActions.length, maxActions );
		}
		
		me.setWidth( maxActions * ( me.iconWidth + 2 ) + 10 );
	},
	
	/**
	 * User-emmited events proccessor
	 * 
	 * @param type
	 * @param view
	 * @param cell
	 * @param recordIndex
	 * @param cellIndex
	 * @param e
	 * @returns
	 */
	processEvent : function( type, view, cell, recordIndex, cellIndex, e )
	{
		var me = this,
		    ret = me.callParent( arguments );
		
		if( type == 'click' ) {		
			var match = e.getTarget().className.match( me.actionIdRe ),
			    action, record;
			
			if( match ) {
				action = me.dataView.getAction( match[1] );
				
	            if( action ) {
	            	record = view.getRecord( view.getNode( recordIndex ) );
	            	
					// before execute
					var be      = me.beforeExecute,
					    beScope = me.beforeExecuteScope || me.scope || window;
					
					if( be && be.apply( beScope, [ [record] ] ) == false ) {
						return;
					}
					
					// execute
					var ae      = me.afterExecute || Ext.emptyFn,
					    aeScope = me.afterExecuteScope || me.scope || window;
					
					action.handler.apply( action, [ [record], ae, aeScope ] );
	            }
	        }
		}
		
		return ret;
    }
});