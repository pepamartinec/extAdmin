Ext.define( 'extAdmin.Model',
{
	extend : 'Ext.data.Model',
	
	idProperty : 'ID'

}, function() {

	// define custom data-types
	Ext.data.Types.DATETIME = {
		type     : 'datetime',
		convert  : function( v ) { return v ? Ext.Date.parse( v, 'Y-m-d H:i:s' ) : null; },
		sortType : Ext.data.SortTypes.asDate
	};
	
	Ext.data.Types.DATE = {
		type     : 'date',
		convert  : function( v ) { return v ? Ext.Date.parse( v, 'Y-m-d' ) : null; },
		sortType : Ext.data.SortTypes.asDate
	};
	
});