Ext.define( 'extAdmin.component.dataBrowser.dataList.feature.actions.ActionsColumn',
{
	extend : 'Ext.grid.column.Column',
	
	alias : 'widget.dynamicactioncolumn',

	texts : {
		header  : 'Akce',
		altText : ''
	},
	
	module : null,
	
	actionIdRe: /x-action-col-name-(\S+)/,
    
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
			
			align        : 'right',
			flex         : false,
			width        : me.iconWidth, // small dummy value, Ext is no able to shrink wide column
			
			renderer     : function( rowActions, meta )
			{
				if( rowActions == null ) {
					return;
				}
				
		    	var icons = [],
		    	    action;
		    	
		    	meta.tdCls += ' '+ Ext.baseCSSPrefix + 'action-col-cell';
		    	for( var i = 0, al = rowActions.length; i < al; ++i ) {
		    		action = me.module.getAction( rowActions[i] );
		    		
		    		if( action == null ) {
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
	
	onRender : function()
	{
		var me = this;
		
		me.callParent( arguments );
		
		var actions = me.module.actions,
		    iconsNo = 0;
		
		for( var aName in actions ) {
			if( actions[ aName ].dataDep == true ) {
				++iconsNo;
			}
		}
		
		me.setWidth( iconsNo * ( me.iconWidth + 2 ) + 10 );
	},
	
	processEvent : function( type, view, cell, recordIndex, cellIndex, e )
	{
		var me = this,
		    ret = me.callParent( arguments );
		
		if( type == 'click' ) {		
			var match = e.getTarget().className.match( me.actionIdRe ),
			    action, record;
			
			if( match ) {
				action = me.module.getAction( match[1] );
				
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