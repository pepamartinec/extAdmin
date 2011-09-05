Ext.define( 'extAdmin.component.FiltersForm',
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
	 * @cfg {extAdmin.panel.feature.DataList} dataList
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
            item;
        
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
				{ text: me.texts.resetBtn, handler: me.reset, scope: me },
				{ text: me.texts.applyBtn, handler: me.apply, scope: me }
			]
		});
		
		me.callParent();
		
		if( me.dataList ) {
			me.linkToDataList( me.dataList );
		}
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
	},
	
	/**
	 * Filters values setter
	 * 
	 * @param {Object} values
	 */
	setValues : function( values )
	{
		this.getForm().setValues( values );
	},
	
	/**
	 * Filters values getter
	 * 
	 * @returns {Object}
	 */
	getValues : function()
	{
		return this.getForm().getValues();
	}
}); 