Ext.define( 'extAdmin.widget.form.plugin.Localizable',
{
	extend : 'Ext.AbstractPlugin',
	
	alias : 'plugin.localizable',
	
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
	
	init : function( form )
	{
		var me = this,
		    localizations = extAdmin.localizations;
		
		me.callParent( arguments );
		
		me.activeLocalization = me.lang || localizations[0];
		
		form.addEvents( 'localizationswitch' );
		
		// create toolbar
		var tbItems = [
			'->',
			{ xtype : 'component', html : 'Jazyk:' },
			{ xtype : 'tbspacer', width : 10 }
		];
		
		var lang;
		for( var i = 0; i < localizations.length; ++i ) {
			lang = localizations[ i ];
			
			tbItems.push({
				text      : me.texts.langs[ lang ],
				iconCls   : 'langIcon inactive missing '+ lang,
				pressed   : lang == me.activeLocalization,
				lang      : lang,
				listeners : {
					click : Ext.Function.pass( me.switchLocalization, [ lang ], me )
				}
			});
		};
		
		me.toolbar = Ext.create( 'Ext.toolbar.Toolbar', {
			dock  : 'top',
			cls   : 'localizationsToolbar',
			items : tbItems
		});
		
		form.addDocked( me.toolbar );
		
		// add hidden language field
		form.add({
			xtype : 'hiddenfield',
			name  : 'language',
			value : me.activeLocalization
		});
		
		form.onFormLoad   = Ext.Function.createInterceptor( form.onFormLoad,   me.onDataReceive, me );
		form.onFormSubmit = Ext.Function.createInterceptor( form.onFormSubmit, me.onDataReceive, me );
		
		Ext.apply( form, {
			switchLocalization : function( lang ) {
				me.switchLocalization( lang );
			}
		});
	},
	
	/**
	 * Returns localization data
	 * 
	 * @param lang
	 * @param useFallback
	 * @returns
	 */
	pickLocalizationData : function( lang, useFallback )
	{
		var me = this;
		
		// pick localization data
		var langData = me.data[ lang ];
		
		// pick default data
		var defaultData = {};
		
		if( useFallback == true ) {
			var localizations = extAdmin.localizations;
			
			for( var i = 0, ll = localizations.length; i < ll; ++i ) {
				var tLang = localizations[ i ];
				
				if( me.data[ tLang ] ) {
					defaultData = me.data[ tLang ];
				}
			}
		}
		
		// merge data
		return Ext.apply( {}, me.data['b'], langData || defaultData, { language : lang } );
	},
	
	/**
	 * Form-data load handler
	 * 
	 * @private
	 * @param {Object} response
	 */
	onDataReceive : function( response )
	{
		var me = this;
		
		if( response.data ) {
			me.data = response.data;
			
			me.updateFlags();
			
			response.data = me.pickLocalizationData( me.activeLocalization, true );
		}
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
	},
	
	/**
	 * Switches localization
	 * 
	 * @public
	 * @param lang
	 */
	switchLocalization : function( lang )
	{
		var me = this;
		
		if( lang == me.activeLocalization ) {
			return;
		}
		
		if( me.warnOnDirty && me.cmp.getForm().isDirty() ) {
			me.cmp.dirtyWarn( function() {
				me.switchLocalization_step1( lang );
			});
			
		} else {
			me.switchLocalization_step1( lang );
		}
	},
	
	/**
	 * Switches localization
	 * 
	 * @private
	 * @param lang
	 */
	switchLocalization_step1 : function( lang )
	{
		var me = this;
		
		if( me.submitOnSwitch ) {
			me.cmp.submit({
				silent  : true,
				success : function() {
					me.switchLocalization_step2( lang );
				}
			});
			
		} else {
			me.switchLocalization_step2( lang );
		}
	},
	
	/**
	 * Switches localization
	 * 
	 * @private
	 * @param lang
	 */
	switchLocalization_step2 : function( lang )
	{
		var me = this;
		
		var oldLocalization = me.activeLocalization;		
		me.activeLocalization = lang;
		me.updateFlags( me.data );
		
		var form = me.cmp.getForm();
		
		// pick localization data
		var langData = me.data[ lang ];
		
		// pick default data
		var defaultData = null;
		
		var localizations = extAdmin.localizations;
		for( var i = 0, ll = localizations.length; i < ll; ++i ) {
			var tLang = localizations[ i ];
			
			if( me.data[ tLang ] ) {
				defaultData = me.data[ tLang ];
			}
		}
		
		// merge data
		var data = Ext.apply( {}, me.data['b'], langData || defaultData );
		data['language'] = lang;
		
		// mark fields with missing translation
		var isPersisted = !!data['ID'];
		
		form.getFields().each( function( field ) {
			if( isPersisted && ( langData == null || ( langData[ field.name ] == null && defaultData[ field.name ] != null ) ) ) {
				field.addCls('missing');
			} else {
				field.removeCls('missing');
			}
		});
		
		// propage data to user
		form.reset();
		form.setValues( data );
		
		// fire event
		me.cmp.fireEvent( 'localizationswitch', oldLocalization, me.activeLocalization, data );
	}
});