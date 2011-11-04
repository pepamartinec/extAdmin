Ext.define( 'extAdmin.action.dataList.Redirect',
{	
	extend : 'extAdmin.action.DataList',
	
	multiRow : true,
	dataDep  : true,
	
	params   : {
		target    : null,
		params    : null,
		newWindow : false,
		idName    : 'recordID'
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
		
		// add IDs of records
	    var IDs = [];
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			var id = records[ i ].internalId;
			
			if( id ) {
				target += delim + me.params.idName +'[]='+ id;
			}
		}
		
		if( Ext.isObject( me.params.params ) ) {
			var params = me.params.params;
			
			for( var name in params ) {
				target += delim + encodeURIComponent( name ) +'='+ encodeURIComponent( params[ name ] );
			}
		}
		
		if( me.params.newWindow ) {
			window.open( target );
		} else {
			window.location = target;
		}		
	}
});
