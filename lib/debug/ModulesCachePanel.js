Ext.define( 'extAdmin.debug.ModulesCachePanel',
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
	
	/**
	 * Panel initialization
	 * 
	 */
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
			title  : 'Loaded modules',
			height : 150,
			
			store : Ext.create( 'Ext.data.Store', {
				model : me.$className +'.Model'
			}),
			
			columns : [{
				header    : 'Name',
				dataIndex : 'name',
				flex      : 1
			},{
				xtype : 'actioncolumn',
				items : [{
					iconCls : 'i-application-osx-terminal',
					tooltip : 'Dump to console',
					handler : function( grid, rowIdx ) {
						var module = me.env.moduleManager.get( me.store.getAt( rowIdx ).get( 'name' ) );
						Ext.log({
							msg  : module.name,
							dump : module.config
						});
					}
				}]
			}],
			
			dockedItems : [{
				dock  : 'top',
				xtype : 'toolbar',
				items : [{
					xtype   : 'button',
					text    : 'Clear cache',
					handler : function() {
						me.env.moduleManager.clearCache();
					}
				}]
			}]
		});
		
		me.callParent( arguments );
		
		var moduleMgr = me.env.moduleManager,
		    modules   = moduleMgr.modules;
		
		// new module
		me.mon( modules, 'add', function( hm, name, module ) {
			var records = me.store.add([{
				name : name
			}]);
			
			me.highlightModule( records[0], 'x-added' );
		});
		
		// removed module
		me.mon( modules, 'clear', function( hm, name, module ) {
			me.store.removeAll();
		});
		
		// read module
		originalGet = moduleMgr.get;
		moduleMgr.get = function( moduleName ) {
			var module = originalGet.apply( moduleMgr, arguments );
			
			var r = me.store.findRecord( 'name', moduleName );
			
			me.highlightModule( r, 'x-read' );
			
			return module;
		};
			
	},
	
	highlightModule : function( moduleRecord, cls )
	{
		var me    = this,
		    rowEl = Ext.get( me.getView().getNode( moduleRecord ) );
		
		if( rowEl ) {
			me.higlightRow( rowEl, cls );
		}		
	},
	
	higlightRow : function( rowEl, cls )
	{
		rowEl.removeCls( 'x-animate' );
		rowEl.addCls( cls );
		
		// delay, so the class modifications can be promoted to DOM
		Ext.Function.createDelayed( function() {
			rowEl.addCls( 'x-animate' );
			rowEl.removeCls( cls );
		}, 1 )();
	}

}, function() {
	
	Ext.define( this.$className +'.Model', {
		extend     : 'Ext.data.Model',
		idProperty : name,
		
		fields : [{
			name : 'name'
		}]
	});	
});