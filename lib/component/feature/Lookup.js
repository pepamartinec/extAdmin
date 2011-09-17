Ext.define( 'extAdmin.component.feature.Lookup',
{	
	/**
	 * Selection model
	 * 
	 * @cfg {Ext.selection.Model}
	 */
	selModel : null,
	
	/**
	 * Mapping between lookup and client data
	 * 
	 * @cfg {Object}
	 */
	mapping : null,
	
	/**
	 * Items selection callback
	 * 
	 * @cfg {Function}
	 */
	onSelection : null,
	
	/**
	 * Items selection callback scope
	 * 
	 * @cfg {Mixed}
	 */
	scope : null,
	
	/**
	 * Mixin constructor
	 * 
	 * @public
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		Ext.apply( me, config );
		
		// check selection model
		if( me.selModel instanceof Ext.selection.Model !== true ) {
			Ext.Error.raise({
				msg      : 'Invalid selection model supplied',
				selModel : me.selModel 
			});
		}
		
		me.isLookup = true;
	},
	
	/**
	 * Returns used selection model
	 * 
	 * @return {Ext.selection.Model}
	 */
	getLookupModel : function()
	{
		return this.selModel;
	},
	
	/**
	 * Returns current selection without mapping application
	 * 
	 * @public
	 * @return {Array}
	 */
	getRawLookupSelection : function()
	{
		return this.selModel.getSelection();
	},
	
	/**
	 * Applies mapping on supplied record
	 * 
	 * @private
	 * @param  {Ext.data.Model} record
	 * @return {Array}
	 */
	transformRecord : function( record )
	{
		var me      = this,
		    mapping = me.mapping,
		    recordData = record.data,
		    resultData = {},
		    colMap;
		
		for( var colName in mapping ) {
			colMap = mapping[ colName ];
			
			// direct string mapping
			if( Ext.isString( colMap ) ) {							
				resultData[ colName ] = recordData[ colMap ];
			
			// columnMapping object
			} else if( Ext.isObject( colMap ) ) {				
				if( Ext.isFunction( colMap.data ) ) {
					resultData[ colName ] = colMap.data.apply( me, [ record ] );
					
				} else {
					resultData[ colName ] = colMap.data;
				}
				
			// <debug>
			// bad definition
			} else {				
				Ext.Error.raise({
					msg      : 'Invalid mapping rule',
					ruleName : colName,
					mapping  : mapping
				});
			// </debug>	
			}	
		}
		
		return resultData;
	},
	
	/**
	 * Returns current selection, supplied mapping is applied
	 * 
	 * @public
	 * @returns {Array}
	 */
	getLookupSelection : function()
	{
		var me  = this,
		    sel = me.getRawLookupSelection();
		
		if( Ext.isObject( me.mapping ) ) {
			var raw = sel;
			sel = [];
			
			for( var i = 0, rl = raw.length; i < rl; ++i ) {
				sel.push( me.transformRecord( raw[ i ] ) );
			}
		}
		
		return sel;
	},
	
	/**
	 * Confirms current selection and pushes it to the client via {@link #onSelection} callback
	 * 
	 * @public
	 */
	confirmLookupSelection : function()
	{
		var me        = this,
		    selection = me.getLookupSelection();
		
		me.getLookupModel().deselectAll();
		
		Ext.callback( me.onSelection, me.scope, [ selection ] );
	}
});
