Ext.define( 'extAdmin.component.dataBrowser.FiltersForm',
{
	extend : 'Ext.form.Panel',

	texts : {
		title    : 'Filtry',
		applyBtn : 'Použít',
		resetBtn : 'Reset'
	},

	/**
	 * List of form items
	 *
	 * @required
	 * @cfg {Object} items
	 */
	items : null,

	/**
	 * Linked dataList
	 *
	 * @cfg {extAdmin.panel.feature.DataBrowser} dataList
	 */
	dataList : null,

	/**
	 * Component initialization
	 *
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;

		// define events
        me.addEvents( 'apply', 'reset' );

        // proccess items
        var items = [],
            name, item;

        for( name in me.items ) {
        	item = me.items[ name ];

        	Ext.apply( item, {
        		name : name
        	});

        	items.push( item );
        }

		Ext.apply( me, {
			title       : me.texts.title,
			bodyPadding : 5,
			fieldDefaults : {
				anchor    : '100%',
				msgTarget : 'side'
			},
			items       : items,
			buttons     : [
				{ text: me.texts.applyBtn, handler: me.apply, scope: me },
				{ text: me.texts.resetBtn, handler: me.reset, scope: me }
			]
		});

		me.callParent( arguments );

		if( me.dataList ) {
			me.linkToDataBrowser( me.dataList );
		}

		var me = this,
		    fields = me.getForm().getFields(),
		    handler = function( field, e ) {
				if( e.getKey() == e.ENTER ) {
					me.apply();
				}
			};

		fields.each( function( field ) {
			field.on( 'specialkey', handler );
		});
	},

	/**
	 * Resets filters
	 *
	 */
	reset : function()
	{
		this.getForm().reset();
		this.fireEvent( 'reset', this.getValues() );
	},

	/**
	 * Applies filters
	 *
	 */
	apply : function()
	{
		this.fireEvent( 'apply', this.getValues() );
	}
});