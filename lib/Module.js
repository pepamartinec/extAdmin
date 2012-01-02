Ext.define( 'extAdmin.Module',
{
	requires : [
		'extAdmin.ModuleRequest'
	],
	
	/**
	 * @public
	 * @config {Object} config
	 */
	config : null,
	
	/**
	 * @protected
	 * @config {extAdmin.Environment}
	 */
	env : null,
	
	/**
	 * @protected
	 * @property {Object} actions
	 */
	actions : null,
	
	/**
	 * @protected
	 * @property {extAdmin.ModuleRequest} request
	 */
	request : null,
	
	/**
	 * @protected
	 * @property {Boolean} isInitialized
	 */
	isInitialized : false,
	
	/**
	 * Constructor
	 * 
	 * @constructor
	 * @param {String} serverHandle
	 * @param {String} name
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;
		
		me.config = config.config;
		me.env    = config.env;
	},
	
	/**
	 * Initializes module
	 * 
	 * @public
	 */
	init : function( config )
	{
		var me = this;
		
		// module is already initialized
		if( me.isInitialized === true ) {
			return;
		}
		
		// init request
		me.request = Ext.create( 'extAdmin.ModuleRequest', {
			envRequest : me.env.request,
			module     : me
		});
//		
//		me.initActions( 'generic' );
//		me.initActions( 'module' );
//		
//		// init request
//		me.request = config. Ext.create( 'extAdmin.Request', {
//			serverHandle : serverHandle,
//			baseParams : {
//				module : name
//			}
//		});
		
		me.isInitialized = true;
	},
	
	createView : function()
	{
		var me     = this,
		    config = Ext.apply( {}, me.config.view );
		
		var type = config.type;
		delete config.type;
		
		return Ext.create( type, config );
	},
	
	
	
	
	
	/**
	 * Creates actions instances of given type
	 * 
	 * @private
	 * @param {Object} actionsDefinitions
	 */
	initActions : function( type, config )
	{
		var me = this,
		    definitions = me.config.actions;
		
		for( var actionName in definitions ) {
			if( definitions.hasOwnProperty( actionName ) === false ) {
				continue;
			}
			
			var definition = definitions[ actionName ];
			
			if( definition.type == null ) {
				Ext.Error.raise({
					msg : 'Missing action type definition for action "'+ actionName +'"',
					actionName : actionName,
					actionDef  : definition
				});
			}
			
			var actionType = Ext.String.capitalize( definition.type ),
			    className  = 'extAdmin.action.'+ type +'.'+ actionType;
			
			if( Ext.ClassManager.get( className ) == null ) {
				continue;
			}
			
			me.actions[ actionName ] = Ext.create( className, Ext.apply({
				name   : actionName,
				module : me
			}, definition, config ) );
		}
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
		return this.config['interface'][ partName ];
	},
	
	getServerConfig : function()
	{
		return this.config['interface'];
	},
	
	/**
	 * Returns given action
	 * 
	 * @param   {String} name
	 * @returns {extAdmin.AbstractAction}
	 */
	getAction : function( name )
	{
		return this.actions[ name ];
	},

	/**
	 * Returns module actions
	 * 
	 * @returns {Object}
	 */
	getActions : function()
	{
		return this.actions;
	},
	
	/**
	 * Updates actions states
	 * 
	 * @public
	 */
	updateActionsStates : function()
	{
		var me = this;
		
		for( var aName in me.actions ) {
			me.actions[ aName ].updateState();
		}
	}
});