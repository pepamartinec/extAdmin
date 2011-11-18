Ext.define( 'extAdmin.popup.Base',
{
	extend : 'Ext.window.Window',
	
	requires : [
		'Ext.layout.container.Fit',
		'Ext.button.Button'
	],
	
	texts : {
		confirmBtn : 'OK',
		cancelBtn  : 'Storno'
	},
	
	/**
	 * Popup content component
	 * 
	 * @cfg {Ext.Component} content
	 */
	panel : null,
	
	/**
	 * Component initialization
	 * 
	 * @private
	 */
	initComponent : function()
	{
		var me = this;
		
		me.addEvents( 'confirm', 'cancel' );
		
		// apply default configs
		Ext.applyIf( me, {
			y           : window.scrollY + 20,
			movable     : false,
			resizable   : true,
			closable    : true,
			modal       : true,
			hidden      : true,
			closeAction : 'close'
		});
		
		var texts = Ext.Object.merge( {}, me.texts, me.panel.texts );
		
		// create standard buttons
		if( me.confirmBtn === undefined ) {
			me.confirmBtn = {
				xtype   : 'button',
				text    : texts.confirmBtn,
				scope   : me,
				handler : me.confirm
			}
		}
		
		if( me.confirmBtn && me.confirmBtn.isButton !== true ) {
			me.confirmBtn = me.createComponent( me.confirmBtn );
		}
		
		if( me.cancelBtn == undefined ) {
			me.cancelBtn = {
				xtype   : 'button',
				text    : texts.cancelBtn,
				scope   : me,
				handler : me.cancel
			};
		}
		
		if( me.cancelBtn && me.cancelBtn.isButton !== true ) {
			me.cancelBtn = me.createComponent( me.cancelBtn );
		}
		
		// init self
		Ext.apply( me, {
			layout  : 'fit',
			items   : [ me.panel ],
			buttons : [ me.confirmBtn, me.cancelBtn ]
		});
		
		me.callParent();
		me.panel = me.items.get( 0 );
		
		// grab child bars
		me.buttonsBar = me.getDockedItems('toolbar[ui="footer"]')[0];
		me.grabBars( me.panel );
	},
	
	/**
	 * Grabs fBar and title from supplied panel
	 * 
	 * @param {Ext.panel.Panel} sourcePanel
	 */
	grabBars : function( sourcePanel )
	{
		var me = this;
		
		if( sourcePanel.getDockedItems == null ) {
			return;
		}
		
		// grab fBar
		var sourceFbar = sourcePanel.getDockedItems('toolbar[ui="footer"]')[0];
		
		if( sourceFbar != null ) {		
			sourcePanel.removeDocked( sourceFbar, false );
			
			var item;
			while( sourceFbar.items.length > 0 ) {
				item = sourceFbar.items.get( 0 );
				
				me.buttonsBar.insert( 0, item );
			}
			
			sourceFbar.destroy();
		}
		
		// grab title & icon
		me.setTitle( sourcePanel.title );
		sourcePanel.setTitle();
		
		me.setIconCls( sourcePanel.iconCls );
		sourcePanel.setIconCls();
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
	
	/**
	 * Confirm button click handler
	 * 
	 * @private
	 */
	confirm : function()
	{
		if( this.fireEvent( 'confirm' ) ) {
			this.closeAction == 'hide' ? this.hide() : this.close();
		}
	},
	
	/**
	 * Cancel button click handler
	 * 
	 * @private
	 */
	cancel : function()
	{
		if( this.fireEvent( 'cancel' ) ) {
			this.closeAction == 'hide' ? this.hide() : this.close();
		}
	},
	
	/**
	 * Centers window on screen
	 * 
	 */
	center : function()
	{
		this.alignTo( Ext.getBody(), 't', [ - this.getWidth() / 2, 20 ] );
	}
});