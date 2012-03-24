Ext.define( 'extAdmin.debug.ConsolePanel',
{
	extend : 'Ext.grid.Panel',
	
	requires : [
		'Ext.data.Store',
		'Ext.data.Model'
	],
	
	/**
	 * @cfg {extAdmin.Environment}
	 */
	env : null,
	
	makeGlobal : false,
	
	/**
	 * Panel initialization
	 * 
	 */
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
			title  : 'Console',
			
			store : Ext.create( 'Ext.data.Store', {
				model : me.$className +'.ItemModel',
				
				proxy : {
					type : 'memory'
				}
			}),
			
			columns : [{
				xtype  : 'templatecolumn',
				width  : 30,
				tpl    : [
					'<tpl if="level != \'log\'">',
						'<img src="images/icons/',
							'<tpl switch="level">',
								'<tpl case="error">',
									'exclamation',
								'<tpl case="warn">',
									'error',
								'<tpl case="info">',
									'information',								
							'</tpl>',
						'.png" />',
					'</tpl>'
				],
				hasCustomRenderer : true
				
			},{
				xtype  : 'actioncolumn',
				width  : 30,
				items  : [{
					iconCls  : 'i-database-gear',
					tooltip  : 'Show dump',
					getClass : function( value, metaData, item ) {
						var cls = [ 'i-database-gear' ];
						
						if( item.get('hasDump') != true ) {
							cls.push( 'x-item-disabled' );
						}
						
						return cls.join(' ');
					},
					
					handler  : function( view, rowIdx, colIdx, item, e ) {				
						var item = me.store.getAt( rowIdx );
						
						if( item.get('hasDump') ) {
							DumpJS.popup( e.xy, item.get('dump') );
						}
					}
				}]
			},{
				dataIndex : 'msg',
				flex      : 1
			}],
			
			dockedItems : [{
				dock  : 'top',
				xtype : 'toolbar',
				items : [{
					xtype   : 'button',
					text    : 'Clear',
					handler : function() {
						me.store.removeAll();
					}
				}]
			}]
		});
		
		me.callParent( arguments );
		
		me.indent = 0;
		
		Ext.log = Ext.Function.bind( me.extLog, me );
		
		Ext.Function.interceptBefore( Ext.Error, 'handle', Ext.Function.bind( me.extException, me ) );
		
//		extAdmin.ErrorHandler.bindHandler( me.error, me );
		
		if( me.makeGlobal === true ) {
			me.registerAsSystem();
		}
	},
	
	extLog : function( item )
	{
		var me = this;
		
		// wrap string into object
		if( Ext.isString( item ) ) {			
			item = {
				msg : item	
			};
		}
		
		// treat additional arguments as part of message
		if( arguments.length > 1 ) {
			item.msg += Array.prototype.slice.call( arguments, 1 ).join('');
		}
		
		// handle indenting
		if( item.indent ) {
			console.warn( '['+ this.$className +'] Indenting is not implemented yet');
			me.indent += 1;
			
		} else if( item.outdent && me.indent > 0 ) {
			console.warn( '['+ this.$className +'] Indenting is not implemented yet');
			me.indent -= 1;
		}		
		console.log(Ext.clone(item));
		// store message
		me.store.add( item );
	},
	
	extException : function( error )
	{
		var me = this;
		
		// extract standard items
		var msg          = error.msg,
		    sourceClass  = error.sourceClass  || 'unknownClass',
		    sourceMethod = error.sourceMethod || 'unknownMethod',
		    dump         = Ext.apply( {}, error );
		
		delete dump.msg;
		delete dump.sourceClass;
		delete dump.sourceMethod;
		
		// store message
		me.store.add({
			msg     : '[ '+ sourceClass +' ][ '+ sourceMethod +' ] '+ msg,
			level   : 'error',
			hasDump : Ext.Object.getKeys( dump ).length > 0,
			dump    : dump
		});
	}
	
}, function() {
	
	Ext.define( this.$className +'.ItemModel', {
		extend : 'Ext.data.Model',
		
		constructor : function( data )
		{
			if( data.hasOwnProperty( 'hasDump' ) === false ) {
				data.hasDump = data.hasOwnProperty( 'dump' );
			}		
			
			this.callParent( arguments );
		},
		
		fields : [{
			name : 'msg'
			
		},{
			name         : 'level',
			defaultValue : 'log'
			
		},{
			name         : 'hasDump',
			type         : 'boolean',
			defaultValue : false
			
		},{
			name    : 'dump',
			useNull : true	
		}]
	});	
});