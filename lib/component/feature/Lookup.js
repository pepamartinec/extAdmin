Ext.define( 'extAdmin.component.feature.Lookup',
{
	isLookup : false,
	
	initLookup : function( source )
	{
		var me = this;
		
		me.lookupSource = source;
		me.isLookup = true;
	},
	
	getSelectionModel : function()
	{
		return this.lookupSource.getSelectionModel();
	},
	
	getSelection : function()
	{
		var ls = this.lookupSource;
		
		return Ext.isFunction( ls.getSelection ) ?
				ls.getSelection() :
				ls.getSelectionModel().getSelection();
	}
});