Ext.define( 'extAdmin.component.form.plugin.Localizable',
{
	extend : 'Ext.AbstractPlugin',
	alias : 'plugin.localizable',
	
	requires : [
		'extAdmin.component.form.backend.Localizable'
	],
	
	texts : {		
		langs : {
			cs : 'Česky',
			en : 'Anglicky',
			de : 'Německy'
		}
	},
	
	lang           : null,
	submitOnSwitch : false,
	warnOnDirty    : true,
	
	/**
	 * Plugin constructor
	 * 
	 * @public
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		if( me.cmp == null ) {
			Ext.Error.raise({
				msg : "Missing 'cmp' item within plugin configuration. "+
					"This plugin is not intended to be initialized directly, "+
					"use configuration object instead"
			});
		}
		
		// use localizable as form data backend
		me.cmp.backend = 'localizable';
	},
	
	/**
	 * Initializes localizations plugin
	 * 
	 * @public
	 * @param {Ext.form.Panel} form
	 */
	init : function( form )
	{
		var me = this;
		
		me.callParent( arguments );
		
		me.activeLocalization = me.lang || extAdmin.localizations[0];
		
		// create toolbar
		form.addDocked( me.createToolbar({
			itemId : 'flagsBar'
		}) );
		me.toolbar = form.getComponent( 'flagsBar' );
		
		// add hidden language field
		if( form.backend.findField( 'language' ) == null ) {
			form.add({
				xtype : 'hiddenfield',
				name  : 'language',
				value : me.activeLocalization
			});
		}
				
		form.switchLocalization = Ext.Function.bind( me.backend.switchLocalization, me );
		form.addEvents( 'localizationswitch' );
	},
	
	/**
	 * Creates flag-switch toolbar
	 * 
	 * @private
	 * @return {Ext.toolbar.Toolbar}
	 */
	createToolbar : function( config )
	{
		var me = this,
		    localizations = extAdmin.localizations,
		    tbItems = [
		    	'->',
		    	{ xtype : 'component', html : 'Jazyk:' },
		    	{ xtype : 'tbspacer', width : 10 }
		    ];
		
		for( var lang, i = 0, ll = localizations.length; i < ll; ++i ) {
			lang = localizations[ i ];
			
			tbItems.push({
				text        : me.texts.langs[ lang ],
				iconCls     : 'langIcon inactive missing '+ lang,
				pressed     : lang == me.activeLocalization,
				lang        : lang,
				listeners   : {
					click : Ext.Function.pass( me.cmp.switchLocalization, [ lang ], me )
				}
			});
		};
		
		return Ext.apply({
			xtype : 'toolbar',
			dock  : 'top',
			cls   : 'localizationsToolbar',
			items : tbItems
		}, config || {} );
	},
	
	/**
	 * Updates flags state according to given object available localizations
	 * 
	 * @private
	 * @param dataObject
	 */
	updateFlags : function()
	{
		var me = this;
		
		// setup flags
		var barItems = me.toolbar.items.items;
		
		for( var i = 0, fl = barItems.length; i < fl; ++i ) {
			flag = barItems[ i ];
			
			// not a flag
			if( flag.type != 'button' || /langIcon/.test( flag.iconCls ) == false ) {
				continue;
			}
			
			// get current flag state
			clsName = flag.btnIconEl ? flag.btnIconEl.dom.className : flag.iconCls;
			
			// determine new flag state
			if( flag.lang ) {				
				// active/inactive
				var isActive = flag.lang == me.activeLocalization;
				
				if( isActive ) {
					clsName = clsName.replace( /inactive/gi, 'active' );
				} else {
					clsName = clsName.replace( /(\s|^)active/gi, ' inactive' );
				}
				
				if( flag.rendered ) {
					flag.toggle( isActive );
				}
				
				// missing/present
				if( me.data['b'].localizations.indexOf( flag.lang ) >= 0 ) {
					clsName = clsName.replace( /missing/gi, 'present' );
				} else {
					clsName = clsName.replace( /present/gi, 'missing' );
				}
			}
			
			// apply new flag state
			if( flag.btnIconEl ) {
				flag.btnIconEl.dom.className = clsName;
			} else {
				flag.iconCls = clsName;
			}
		}
	}
});