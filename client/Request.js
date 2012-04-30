/**
 * Request helper class
 *
 * @class extAdmin.Request
 */
Ext.define( 'extAdmin.Request',
{
	extend : 'Ext.data.Connection',

	requires : [
		'Ext.data.proxy.Ajax',
		'Ext.data.reader.Json',
		'extAdmin.popup.ActionRun'
	],

	uses : [
		'Ext.data.Store',
		'Ext.data.TreeStore',
	],

	statics : {
		FAIL_COMM   : 'comm',
		FAIL_SERVER : 'server'
	},

	/**
	 * @cfg {String} serverEndpoint
	 */
	serverEndpoint : null,

	/**
	 * Request object constructor
	 *
	 */
	constructor : function( config )
	{
		var me = this;

		me.addEvents( 'beforeaction', 'action' );

		me.callParent( arguments );
	},

	/**
	 * Builds request URL
	 *
	 * @param {String} [module] Module name
	 * @param {String} [action] Action name
	 * @param {Object} [urlParams=null] Additional request parameters
	 * @return {String}
	 */
	buildUrl : function( module, action, urlParams )
	{
		urlParams = Ext.apply( urlParams || {}, {
			module : module,
			action : action
		});

		return this.serverEndpoint +'?'+ Ext.urlEncode( urlParams );
	},

	/**
	 * Runs server action
	 *
	 * @async
	 * @param {Array} action Action pointer
	 * @param {Object} config Request configuration
	 *   @param {Ext.AbstractComponent} config.maskTarget Component to overlay with progress bar
	 *   @param {String} [config.message] Message to show in overlay progress bar
	 *   @param {Boolean} [config.async=true] Whether the action should by run asynchrously
	 *   @param {Object} [config.data] Data to send
	 *   @param {Boolean} [config.preprocessResults=true] Enables data preprocessing (decodes JSON data & handles potential errors)
	 *   @param {Object} [config.scope] Scope for callback
	 *   @param {Function} [config.complete] Action complete callback, will be called for any completed action
	 *     @param {Object} [config.complete.response] Server response object
	 *   @param {Function} [config.success] Action success callback, will be called for successful action
	 *     @param {Object} [config.success.response] Server response object
	 *  @param {Function} [config.failure] Action success callback, will be called when action call fails
	 *     @param {Object} [config.failure.response] Server response object
	 * @return {Object} The request object, which may be used to cancel the request
	 */
	runAction : function( action, config )
	{
		var me = this;

		config = config || {};

		// fire before-event
		if( me.fireEvent( 'beforeaction', action, config ) === false ) {
			return;
		}

		var maskTarget = config.maskTarget,
		    message    = config.message,
		    popup      = null;

		if( maskTarget ) {
			popup = Ext.create( 'extAdmin.popup.ActionRun', {
// FIXME make popup modal only on its maskTarget, not a whole window
//				renderTo : maskTarget.getEl()
			});
			popup.showProgress( message );
		}

		return me.request({
			url : me.buildUrl( action[0], action[1] ),

			method : 'POST',
			async  : config.async !== false,
			jsonData : {
				parameters : Ext.apply( {}, config.params || {}, action[2] ),
				data       : config.data || null
			},

			callback : function( options, success, response ) {
				if( popup ) {
					popup.close();
				}

				var responseContent = null;

				// server responded OK
				if( success ) {

					// server responded valid JSON
					try {
						responseContent = Ext.JSON.decode( response.responseText );

						if( responseContent.success !== true ) {
							responseContent.failureType = extAdmin.Request.FAIL_SERVER;
							responseContent.failureCode = null;
						}

					// server responded malformed JSON
					} catch( e ) {
						responseContent = {
							success     : false,
							failureType : extAdmin.Request.FAIL_COMM,
							failureCode : null,
							message     : 'Server response is not a valid JSON string',
							data        : response.responseText
						};
					}

				// server responded NOT OK
				} else {
					responseContent = {
						success     : false,
						failureType : extAdmin.Request.FAIL_COMM,
						failureCode : response.status,
						message     : response.statusText,
						data        : response.responseText
					};
				}

				// call 'callback' callback (callback with original response)
				Ext.callback( config.callback, config.scope, arguments );

				// call 'complete' callback (callback with preprocessed response)
				Ext.callback( config.complete, config.scope, [ responseContent ] );

				// call 'success' callback
				if( responseContent.success ) {
					Ext.callback( config.success, config.scope, [ responseContent ] );

				// call 'failure' callback
				} else {

					// communication failures are treated as exceptions
					if( responseContent.failureType === extAdmin.Request.FAIL_COMM ) {
						if( Ext.callback( config.exception, config.scope, [ responseContent ] ) !== true ) {
							Ext.Error.raise({
								action : action,
								msg    : response.statusText,
								status : response.status,
								data   : response.responseText
							});
						}

					} else {
						Ext.callback( config.failure, config.scope, [ responseContent ] );
					}
				}

				// fire complete-event
				if( me.fireEvent( 'action', action, config, responseContent ) === false ) {
					return;
				}
			}
		});
	},

	/**
	 * Runs server action
	 *
	 * @async
	 * @param {Array} action Action pointer
	 * @param {Object} config Request configuration
	 *   @param {Ext.AbstractComponent} config.maskTarget Component to overlay with progress bar
	 *   @param {String} [config.message] Message to show in overlay progress bar
	 *   @param {Boolean} [config.async=true] Whether the action should by run asynchrously
	 *   @param {Object} [config.data] Data to send
	 *   @param {Boolean} [config.preprocessResults=true] Enables data preprocessing (decodes JSON data & handles potential errors)
	 *   @param {Object} [config.scope] Scope for callback
	 *   @param {Function} [config.complete] Action complete callback, will be called for any completed action
	 *     @param {Object} [config.complete.response] Server response object
	 *   @param {Function} [config.success] Action success callback, will be called for successful action
	 *     @param {Object} [config.success.response] Server response object
	 *  @param {Function} [config.failure] Action success callback, will be called when action call fails
	 *     @param {Object} [config.failure.response] Server response object
	 * @return {Object} The request object, which may be used to cancel the request
	 */
	runRawAction : function( action, config )
	{
		var me = this;

		config = config || {};

		// fire before-event
		if( me.fireEvent( 'beforeaction', action, config ) === false ) {
			return;
		}

		var maskTarget = config.maskTarget,
		    message    = config.message,
		    popup      = null;

		if( maskTarget ) {
			popup = Ext.create( 'extAdmin.popup.ActionRun', {
// FIXME make popup modal only on its maskTarget, not a whole window
//				renderTo : maskTarget.getEl()
			});
			popup.showProgress( message );
		}

		return me.request({
			url : me.buildUrl( action[0], action[1] ),

			method : 'POST',
			async  : config.async !== false,
			jsonData : {
				parameters : Ext.apply( {}, config.params || {}, action[2] ),
				data       : config.data || null
			},

			callback : function( options, success, response ) {
				if( popup ) {
					popup.close();
				}

				// call 'complete' callback (callback with preprocessed response)
				Ext.callback( config.complete, config.scope, [ response.responseText ] );

				// call 'success' callback
				if( success ) {
					Ext.callback( config.success, config.scope, [ response.responseText ] );

				// call 'failure' callback
				} else {
					if( Ext.callback( config.exception, config.scope, [ response ] ) !== true ) {
						Ext.Error.raise({
							action : action,
							msg    : response.statusText,
							status : response.status,
							data   : response.responseText
						});
					}
				}
			}
		});
	}
});