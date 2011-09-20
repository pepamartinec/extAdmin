Ext.define( 'extAdmin.component.form.backend.Localizable',
{
	extend : 'extAdmin.component.form.backend.Basic',
	alias  : 'formbackend.localizable',
	
	/**
	 * Currently active localization
	 * 
	 * @cfg {String} activeLocalization
	 * @property {String} activeLocalization
	 */
	activeLocalization : null,
	
	/**
	 * If true, fallback localization will be automatically loaded instead
	 * of the missing one
	 * 
	 * @cfg {Boolean} useFallback
	 * @property {Boolean} useFallback
	 */
	useFallback : true,
	
	/**
	 * If true, localization data will be automatically submitted on localization switch
	 * 
	 * FIXME this has to be TRUE for now, we do not currently 100% know, which fields are localized and which not
	 * 	Server is not responsible for sending complete data objects, so form may contain more fields, than LOAD
	 * 	action receives.
	 *  This should be solved, when forms will be modules on their own. 
	 * 
	 * @cfg {Boolean} submitOnSwitch
	 * @property {Boolean} submitOnSwitch 
	 */
	submitOnSwitch : true,
	
	/**
	 * Backend constructor
	 * 
	 * @param config
	 */
	constructor : function( owner, config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		owner.items.push({
			xtype : 'hiddenfield',
			name  : 'language'
		});
		
		// init events
		me.addEvents(
			/**
			 * Fires before localization switch is performed. Return false to cancel the switch.
			 * 
			 * @event beforeswitch
			 * @param {extAdmin.component.form.backend.Localizable} this
			 * @param {String} newLocalization
			 */
			'beforeswitch',
			
			/**
			 * Fires when localization is switched.
			 * 
			 * @event switch
			 * @param {extAdmin.component.form.backend.Localizable} this
			 */
			'switch',
			
			/**
			 * Fires when internal data are changed in bulk (i.e. via {@link #setValues()}.
			 * 
			 * @event datachange
			 * @param {extAdmin.component.form.backend.Localizable} this
			 */
			'datachange'
		);
		
		// init active localization
		if( me.activeLocalization == null ) {
			me.activeLocalization = extAdmin.localizations[0];
		}
		
		/**
		 * Internal data storage
		 * 
		 * @private
		 * @property {Object} data
		 */
		me.data = {};
		
		
	},
	
	/**
	 * Checks wether supplied data are localized or not
	 * 
	 * @private
	 * @param {Object} data
	 */
	isLocalized : function( data )
	{
		return Ext.isObject( data['b'] );
	},
	
	/**
	 * Checks wether given localizations exists within current data
	 * 
	 * @public
	 * @param {String} lang
	 */
	hasLocalization : function( lang )
	{
		return this.data && this.data['b'].localizations.indexOf( lang ) >= 0;
	},
	
	/**
	 * Returns currently active localization
	 * 
	 * @public
	 * @return {String}
	 */
	getActiveLocalization : function()
	{
		return this.activeLocalization;
	},
	
	/**
	 * Bulk form data setter
	 * 
	 * @public
	 * @param {Object} data
	 */
	setValues : function( data )
	{
		var me = this;
		
		if( me.isLocalized( data ) ) {
			me.data = data;
			me.setLocalization( me.activeLocalization, me.useFallback );
			
		} else {
			me.data = null;
			me.callParent( arguments );
		}
		
		me.fireEvent( 'datachange', me );
	},
	
	/**
	 * Switches localization
	 * 
	 * @public
	 * @param {String} lang
	 */
	switchLocalization : function( lang )
	{
		var me = this;
		
		// cancel switch when lang matches current one
		if( lang == me.activeLocalization ) {
			return;
		}
		
		if( me.fireEvent( 'beforeswitch', me, lang ) ) {
			if( me.submitOnSwitch ) {
				me.submit({
					silent  : true, // FIXME workaround to not close form-popup
					success : function() {
						me.setLocalization( lang );
						me.fireEvent( 'switch', me );
					}
				});
				
			} else {
				me.setLocalization( lang );
				me.fireEvent( 'switch', me );
			}
		}
	},
	
	/**
	 * Sets localization to given language
	 * 
	 * @private
	 * @param {String} lang
	 */
	setLocalization : function( lang, useFallback )
	{
		var me = this;
				
		me.activeLocalization = lang;
		
		var baseData    = me.data['b'] || {},
		    langData    = me.data[ lang ] || {},
		    defaultData = {};
		
		if( Ext.valueFrom( useFallback, me.useFallback ) ) {
			var localizations = extAdmin.localizations;
			
			for( var i = 0, ll = localizations.length; i < ll; ++i ) {
				var tLang = localizations[ i ];
				
				if( me.data[ tLang ] ) {
					defaultData = me.data[ tLang ];
					break;
				}
			}
		}
		
		var isPersisted = !!baseData['ID'];
		baseData['language'] = lang;
		
		me.getFields().each( function( field ) {
			var fName = field.name,
			    isMissing = isPersisted && ( langData == null || ( langData.hasOwnProperty( fName ) === false && defaultData.hasOwnProperty( fName ) === true ) );
			
			field.setValue( baseData[ fName ] || langData[ fName ] );
			if( me.trackResetOnLoad ) {
                field.resetOriginalValue();
            }
			
			if( isMissing ) {
				field.addCls('missing');
				
				if( defaultData.hasOwnProperty( fName ) ) {
					field.setValue( defaultData[ fName ] );
				}
				
			} else {
				field.removeCls('missing');
			}
		});
	}
});