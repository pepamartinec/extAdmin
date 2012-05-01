Ext.define( 'extAdmin.DataProxy',
{
	extend : 'Ext.data.proxy.Server',
	alias  : 'proxy.extadmin',

	requires : [
		'Ext.data.reader.Json',
		'Ext.data.writer.Json'
	],

	/**
	 * @required
	 * @cfg {extAdmin.Environment} env
	 */
	env : null,

	/**
	 * @cfg {Array} loadAction
	 */
	loadAction : null,

	/**
	 * @cfg {Array} writeAction
	 */
	writeAction : null,

	/**
	 * Proxy constructor
	 *
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;

		if( config.loadAction ) {
			config.reader = {
				type : 'json',

				messageProperty : 'message',
				root            : 'data',
				successProperty : 'success',
				totalProperty   : 'total'
			};
		}

		if( config.writeAction ) {
			config.writer = {
				type : 'json',

				allowSignle : false,
				root        : 'data'
			};
		}

		me.callParent( arguments );

		me.addEvents( 'beforerequest', 'request' );
	},

    /**
     * Encodes the array of {@link Ext.util.Filter} objects
     *
     * @param {Ext.util.Filter[]} filters The array of {@link Ext.util.Filter Filter} objects
     * @return {String} The encoded filters
     */
    encodeFilters : function( filters )
    {
        var encoded = {};

        for( var i = 0, fl = filters.length; i < fl; ++i ) {
            encoded[ filters[i].property ] = filters[i].value;
        }

        return encoded;
    },

    /**
     * Encodes the array of {@link Ext.util.Sorter} objects
     *
     * @param {Ext.util.Sorter[]} sorters The array of {@link Ext.util.Sorter Sorter} objects
     * @return {String} The encoded sorters
     */
    encodeSorters : function( sorters )
    {
        var encoded = {};

        for( var i = 0, sl = sorters.length; i < sl; ++i ) {
            encoded[ sorters[i].property ] = sorters[i].direction;
        }

        return encoded;
    },

	/**
	 * Runs operation
	 *
	 * @param {Ext.data.Operation} operation
	 * @param {Function} callback
	 * @param {Object} scope
	 * @return {Object/Null}
	 */
	doRequest : function( operation, callback, scope )
	{
		var me = this;

		// build Ext.data.Request similiar way as Ajax proxy
		// so we stay compatible with ordinary proxies
		var request = me.buildRequest( operation, callback, scope );

		if( operation.allowWrite() ) {
			request = writer.write( request );
		}

		Ext.apply( request, {
			method   : 'POST',
			timeout  : me.timeout,
			scope    : me,
//			callback : me.createRequestCallback( request, operation, callback, scope ),
			disableCaching : false
		});

		var data   = Ext.apply( request.jsonData || {}, request.data || {} ),
		    params = request.params;

		request.params = undefined;

		// transform Ext.data.Request to extAdmin action
		var action = ( request.operation.action === 'read' ) ? me.loadAction : me.writeAction;

		return me.env.request.runAction( action, {
			preprocessResults : false,

			data   : data,
			params : params,

			scope    : me,
			callback : me.createRequestCallback( request, operation, callback, scope )
		});
	},

	/**
	 * Returns request URL using operation action
	 *
	 * @param {Object} request
	 * @return {String}
	 */
	getUrl : function( request )
	{
		var me         = this,
		    action     = ( request.operation.action === 'read' ) ? me.loadAction : me.writeAction,
		    envRequest = me.env.request;

		return envRequest.buildUrl( action[0], action[1] );
	},

	createRequestCallback : function( request, operation, callback, scope )
	{
		var me = this;

		return function( options, success, response ) {
			me.processResponse( success, operation, request, response, callback, scope );
		};
	}
});