Ext.define( 'extAdmin.Module',
{
	requires : [
		'extAdmin.Request',
		'inspirio.String',
		'Ext.ClassManager',
		'Ext.Error'
	],
	
	/**
	 * @property {String} name
	 */
	
	/**
	 * @property {Object} config
	 */
	
	/**
	 * @property {Object} actions
	 */
	
	/**
	 * @property {extAdmin.Request} request
	 */
	
	/**
	 * Constructor
	 * 
	 * @constructor
	 * @param {String} serverHandle
	 * @param {String} name
	 * @param {Object} config
	 */
	constructor : function( serverHandle, name, config )
	{
		var me = this;
		
		me.name   = name;
		me.config = config['interface'];
		
		// init actions
		me.createActions( config.actions || {} );
		
		// init request
		me.request = Ext.create( 'extAdmin.Request', {
			serverHandle : serverHandle,
			baseParams : {
				module : name
			}
		});
	},
	
	/**
	 * Creates module actions instances
	 * 
	 * @private
	 * @param {Object} actionsDefinitions
	 */
	createActions : function( actionsDefinitions )
	{
		var me = this,
		    actions = {};
		
		for( var actionName in actionsDefinitions ) {
			if( actionsDefinitions.hasOwnProperty( actionName ) === false ) {
				continue;
			}
				
			var definition = actionsDefinitions[ actionName ],
			    type       = inspirio.String.ucfirst( definition.type ),
			    className  = 'extAdmin.action.'+ type;
			
			if( Ext.ClassManager.get( className ) == false ) {
				Ext.Error.raise( 'Invalid action type "'+ type + '" for action "'+ actionName +'"' );
			}
			
			actions[ actionName ] = Ext.create( className, me, actionName, definition );	
		}
		
		me.actions = actions;
	},
	
	/**
	 * Builds request URL with given params
	 * 
	 * @param params
	 * @returns {String}
	 */
	buildUrl : function( params )
	{
		return this.request.buildUrl( params );
	},
	
	/**
	 * Creates dataStore using baseParams and given config
	 * 
	 * @param {Object} options
	 * @returns
	 */
	createStore : function( options )
	{
		return this.request.createStore( options );
	},
	
	/**
	 * Returns configuration for given part of module
	 * 
	 * @protected
	 * @param {String} partName
	 * @returns
	 */
	getPartConf : function( partName )
	{
		return this.config[ partName ];
	},
	
	getServerConfig : function()
	{
		return this.config;
	},
	
	/**
	 * Returns given action
	 * 
	 * @param {String} name
	 */
	getAction : function( name )
	{
		return this.actions[ name ];
	}
});