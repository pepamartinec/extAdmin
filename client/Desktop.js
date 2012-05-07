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
		'extAdmin.debug.ConsolePanel',
		'extAdmin.debug.CommunicationPanel',
		'extAdmin.debug.ModulesCachePanel'
		//</debug>
	],

	/**
	 * @required
	 * @cfg {extAdmin.Environment}
	 */
	env : null,

	/**
	 * @cfg {Object[]} menuItems
	 */
	menuItems : null,

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

		var store = me.env.createStore({
			loadAction : [ '\\ExtAdmin\\Module\\SystemModule', 'getMenuItems' ],
			fields     : [ 'name', 'iconCls', 'entryModule' ]
		});

		if( config.menuItems ) {
			store.loadData( config.menuItems );

		} else {
			store.load();
		}

		me.modulesPanel = Ext.create( 'Ext.view.View', {
			region     : 'west',
			width      : 125,
			autoScroll : true,

			componentCls : 'x-modules-list',
			itemCls      : 'module',
			itemTpl      : [
				'<span class="x-icon {iconCls}"></span>{name}'
			],

			store : store,

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

//		me.debugPanel = Ext.create( 'Ext.tab.Panel', {
//			region      : 'south',
//			title       : 'Debug panel',
//			split       : true,
//			collapsible : true,
//			height      : 200,
//
//			items  : [
//				Ext.create( 'extAdmin.debug.ConsolePanel', {
//					env : me.env
//				}),
//
//				Ext.create( 'extAdmin.debug.CommunicationPanel', {
//					env : me.env
//				}),
//
//				Ext.create( 'extAdmin.debug.ModulesCachePanel', {
//					env : me.env
//				}),
//			]
//		});

		Ext.apply( me, {
			layout : 'border',
			items  : [ me.modulesPanel, me.contentPanel ]
		});

		me.callParent( arguments );
	},

	openModule : function( module )
	{
		var me   = this,
		    view = null;
console.log('open', module);
//		try {
			// launch new module
			module = me.env.moduleManager.get( module );
			view   = module.createView();

//		} catch( e ) {
//			Ext.Error.raise({
//				msg   : e.message,
//				stack : e.stack
//			});
//		}

		// if new view was successfuly created
		if( view ) {
			// remove old module
			if( me.activeComponent ) {
				me.contentPanel.remove( me.activeComponent, true );
			}

			// display new module
			me.contentPanel.add( view );

			me.activeModule    = module;
			me.activeComponent = view;
		}

		me.modulesPanel.select( me.modulesPanel.getStore().findRecord( 'entryModule', module.name ) );
	}
});
