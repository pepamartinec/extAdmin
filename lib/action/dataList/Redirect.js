Ext.define( 'extAdmin.action.dataList.Redirect',
{	
	extend : 'extAdmin.action.DataList',
	
	multiRow : true,
	dataDep  : true,
	
	params   : {
		target    : null,
		newWindow : false
	},

	/**
	 * Constructor
	 * 
	 * @constructor
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		if( Ext.isArray( config.params.target ) ) {
			target = config.params.target;
			
			config.params.target = extAdmin.serverHandle +'?module='+ target[0] +'&action='+ target[1];
		}
		
		me.callParent( arguments );
	},
	
	handler : function( records, cb, cbScope )
	{
		var me = this,
		    target = me.params.target,
		    delim  = target.indexOf('?') == -1 ? '?' : '&',
		    recordID = records[0] ? records[0].getId() : null;
		
		target += delim +'recordIDs[]='+ recordID;
		
		if( me.params.newWindow ) {
			window.open( target );
		} else {
			window.location = target;
		}		
	}
});
