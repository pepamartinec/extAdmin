Ext.define( 'extAdmin.Desktop',
{
	extend : 'Ext.container.Viewport',
	
	requires : [
		'Ext.layout.container.Border',
		'Ext.view.View',
		'Ext.container.Container',
		'Ext.layout.container.Fit',
		'extAdmin.Store'
	],
	
	uses : [
		//<debug>
		'extAdmin.debug.ModulesCachePanel'
		//</debug>
	],
	
	/**
	 * @config {extAdmin.Environment}
	 */
	env : null,
	
	/**
	 * @private
	 * @property {extAdmin.Module}
	 */
	activeModule : null,
	
	/**
	 * @private
	 * @property {Ext.AbstractComponent}
	 */
	activeComponent : null,
	
	/**
	 * Desktop constructor
	 * 
	 * @param config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.env = config.env;
		
		me.modulesPanel = Ext.create( 'Ext.view.View', {
			region     : 'west',
			width      : 125,
			autoScroll : true,
			
			componentCls : 'x-modules-list',
			itemCls      : 'module',
			itemTpl      : [
				'{name}'
			],
			
			store : me.env.createStore({
				loadAction : [ '\\ExtAdmin\\Module\\SystemModule', 'getMenuItems' ],
				
				autoLoad : true,
				fields   : [ 'name', 'entryModule' ]
			}),
			
			listeners    : {
				itemclick : function( view, module ) {
					me.openModule( module.get( 'entryModule' ) );
				}
			}
		});
		
		me.contentPanel = Ext.create( 'Ext.container.Container', {
			region : 'center',
			layout : 'fit'
		});		
		
		me.debugPanel = Ext.create( 'Ext.tab.Panel', {
			region      : 'south',
			title       : 'Debug panel',
			split       : true,
			collapsible : true,
			height      : 200,
			
			items  : [
			//	Ext.create( 'extAdmin.debug.DebugPanel' ),
				
				Ext.create( 'extAdmin.debug.ModulesCachePanel', {
					env : me.env
				}),				
			]
		});
		
		Ext.apply( me, {
			layout : 'border',
			items  : [ me.modulesPanel, me.contentPanel, me.debugPanel ]
		});
		
		me.callParent( arguments );
	},
	
	openModule : function( module )
	{
		var me = this;
		
		// remove old module
		if( me.activeModule != null ) {
			me.contentPanel.remove( me.activeComponent, true );
			me.activeModule = null;
		} else {
		
		// launch new module
		me.activeModule    = me.env.moduleManager.get( module );
		me.activeComponent = me.activeModule.createView();
		
		me.contentPanel.add( me.activeComponent );
		}
		console.info( module + ' module opened');
	}
});
