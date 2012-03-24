Ext.define( 'extAdmin.debug.CommunicationPanel',
{
	extend : 'Ext.grid.Panel',
	
	requires : [
		'Ext.data.Store',
		'Ext.data.Model',
		'Ext.grid.RowNumberer',
		'Ext.grid.column.Template'
	],
	
	/**
	 * @cfg {extAdmin.Environment}
	 */
	env : null,
	
	/**
	 * List of currently running actions
	 * 
	 * @property {Array} running
	 */
	running : null,
	
	missedCount : 0,
	
	baseTitle : 'Communication',
	
	/**
	 * Panel initialization
	 * 
	 */
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
			title  : me.baseTitle,
			
			store : Ext.create( 'Ext.data.Store', {
				model : me.$className +'.Model'
			}),
			
			columns  : [{
				xtype: 'rownumberer'
				
			},{
				xtype  : 'templatecolumn',
				width  : 30,
				tpl    : [
					'<img src="images/icons/bullet_',
						'<tpl if="response == null">',
							'black',
						'<tpl elseif="response.success == true">',
							'green',
						'<tpl else>',
							'red',
						'</tpl>',
					'.png" />'
				],
				hasCustomRenderer : true
				
			},{
				xtype  : 'actioncolumn',
				header : 'Dump',
				width  : 50,
				items  : [{
					iconCls : 'i-server-to',
					tooltip : 'Dump request',
					handler : function( view, rowIdx, colIdx, item, e ) {						
						var request = me.store.getAt( rowIdx ).get( 'request' );
						
						DumpJS.popup( e.xy, request );
					}
				},{
					iconCls : 'i-server-from',
					tooltip : 'Dump response',
					handler : function( view, rowIdx, colIdx, item, e ) {						
						var response = me.store.getAt( rowIdx ).get( 'response' );
						
						DumpJS.popup( e.xy, response );
					}
				}]
			},{
				xtype  : 'templatecolumn',
				header : 'Module',
				width  : 400,
				tpl    : '{[ values.request.action[0] ]}',

				hasCustomRenderer : true
				
			},{
				xtype  : 'templatecolumn',
				header : 'Action',
				width  : 150,
				tpl    : '{[ values.request.action[1] ]}',

				hasCustomRenderer : true
				
			},{
				flex : true
				
			},{
				xtype  : 'templatecolumn',
				header : 'Time',
				tpl    : [
					'<tpl if="values.startTime && values.endTime">', 
						'{[ Ext.util.Format.number( values.endTime.getTime() - values.startTime.getTime(), "0.00" ) +" ms" ]}',
					'<tpl else>',
						'--',
					'</tpl>'
				],
				
				hasCustomRenderer : true
				
			}]
		});
		
		me.callParent( arguments );
		
		me.view.on( 'itemadd', function() {
			me.view.getEl().scroll( 'bottom', 1000 );
		} );
		
		var request = me.env.request;
		
		me.mon( request, 'beforeaction', me.beforeAction, me );
		me.mon( request, 'action',       me.afterAction, me );			
	},
	
	onShow : function()
	{
		var me = this;
		
		me.setTitle( me.baseTitle );
		me.missedCount = 0;
		
		me.callParent( arguments );
	},
	
	beforeAction : function( action, config )
	{
		var me = this;
		
	    me.store.add({
	    	request : {
	    		action : action,
	    		config : config
	    	},
	    	
	    	startTime : new Date()
	    });
	    
	    if( me.isHidden() ) {
	    	me.setTitle( me.baseTitle +' ['+ ( ++me.missedCount ) +']' );
	    }
	},
	
	afterAction : function( action, config, response )
	{
		var me        = this,
		    matcher   = function( record ) { return record.data.request.action === action; },
		    recordIdx = me.store.findBy( matcher ),
		    record    = me.store.getAt( recordIdx );
		    
		if( record ) {
			record.set({
				response : response,
				endTime  : new Date()
			});
		}
	}

}, function() {
	
	Ext.define( this.$className +'.Model', {
		extend : 'Ext.data.Model',
		
		fields : [{
			name : 'request'
		},{
			name    : 'response',
			useNull : true,
			defaultValue : null
		},{
			name : 'startTime'
		},{
			name : 'endTime'
		}]
	});	
});