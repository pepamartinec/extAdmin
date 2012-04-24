Ext.define( 'extAdmin.component.editor.Popup',
{
	extend : 'Ext.window.Window',

	requires : [
		'Ext.layout.container.Fit'
	],

	/**
	 * @required
	 * @cfg {extAdmin.Module} module
	 */
	module : null,

	/**
	 * @required
	 * @cfg {Ext.AbstractComponent} editor
	 */
	editor : null,

	/**
	 * Popup initialization
	 *
	 */
	initComponent : function()
	{
		var me = this;

		// apply default configs
		Ext.apply( me, {
			y           : window.scrollY + 20,
			movable     : false,
			resizable   : true,
			maximizable : true,
			closable    : true,
			modal       : true,
			closeAction : 'destroy',

			layout : 'fit'
		});

		Ext.apply( me, {
			items   : [ me.editor ]
		});

		me.editor.viewRegion = me;

		me.callParent( arguments );

		me.grabPanelDecoration( me.editor );
	},

	/**
	 * Grabs panel docks, title, icon, etc.
	 *
	 * @param {Ext.panel.Panel} panel
	 */
	grabPanelDecoration : function( panel )
	{
		var me = this;

		me.suspendLayouts();

		me.grabPanelItem( panel, 'title' );
		me.grabPanelItem( panel, 'icon' );
		me.grabPanelItem( panel, 'iconCls' );
		me.grapPanelDocks( panel );

		me.resumeLayouts( true );
	},

	grabPanelItem : function( panel, item )
	{
		var me = this,
		    capitalItem = Ext.String.capitalize( item ),
		    changeEv    = item.toLowerCase() +'change',
		    setter      = 'set' + capitalItem;

		// copy current value
		me[ setter ]( panel[ item ] );
		panel[ setter ]();

		// override item setter
		panel[ setter ] = me[ setter ] = function( value )
		{
			var oldValue = me[ item ];

			// set window item value
			me.prototype[ setter ]( value );

			// fake panel item value change
			panel[ item ] = value;
			panel.fireEvent( changeEv, panel, value, oldValue );
		};
	},

	grapPanelDocks : function( panel )
	{
		var me = this;

		Ext.Array.forEach( panel.getDockedItems(), function( dock ) {
			// remove bar from panel
			panel.removeDocked( dock, false );

			me.addDocked( dock );
		});
	},

	/**
	 * Suspend popup controls
	 *
	 */
	suspendControls : function()
	{
		this.suspendedControls = [];
		var docks = this.getDockedItems(),
		    dock,
		    dockItems,
		    item;

		for( var i = 0, dl = docks.length; i < dl; ++i ) {
			dock      = docks[ i ];
			dockItems = dock.query('button, tool');

			for( var j = 0, dil = dockItems.length; j < dil; ++j ) {
				item = dockItems[ j ];

				if( item.isDisabled() != true ) {
					item.disable();
					this.suspendedControls.push( item );
				}
			}
		}
	},

	/**
	 * Re-enables popup controls
	 *
	 */
	resumeControls : function()
	{
		if( this.suspendedControls ) {
			var item;

			for( var i = 0, scl = this.suspendedControls.length; i < scl; ++i ) {
				item = this.suspendedControls[ i ];

				item.enable();
			}

			this.suspendedControls = [];
		}
	},
});