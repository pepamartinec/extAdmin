Ext.define( 'extAdmin.Module',
{
	requires : [
		'extAdmin.action.ActionManager'
	],
	
	/**
	 * @protected
	 * @config {Object} config
	 */
	config : null,
	
	/**
	 * @protected
	 * @config {Object} name
	 */
	name : null,
	
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
		me.name   = config.name;
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
	
	/**
	 * Returns module name
	 * 
	 * @return {String}
	 */
	getName : function()
	{
		return this.name;
	},
	
	/**
	 * Returns application environment
	 * 
	 * @return {extAdmin.Environment}
	 */
	getEnvironment : function()
	{
		return this.env;
	},
	
	/**
	 * Creates module view component
	 * 
	 * @param  {Object} config
	 * @return
	 */
	createView : function( config )
	{
		var me = this;
		
		config = config || {};
		
		Ext.applyIf( config, me.config.view );
		Ext.applyIf( config, { module : me });
		
		var type = config.type;
		delete config.type;
		
		return Ext.create( type, config );
	},
	
	/**
	 * Creates actions defined for the module
	 * 
	 * @param  {Object} factoryConfig
	 * @return {Object}
	 */
	factoryActions : function( factoryConfig )
	{
		for( var categoryName in factoryConfig ) {
			if( factoryConfig.hasOwnProperty( categoryName ) === false ) {
				continue;
			}
			
			var category = factoryConfig[ categoryName ];
			
			if( category.module === undefined ) {
				category.module = this;
			}
		}
		
		return extAdmin.action.ActionManager.factoryActions( this.config.actions, factoryConfig );
	},
	
	/**
	 * Builds request URL with given params
	 * 
	 * @param params
	 * @returns {String}
	 */
	buildUrl : function( params )
	{
		if( Ext.isDefined( params.module ) === false ) {
			params.module = this.name;
		}
		
		return this.env.request.buildUrl( params );
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
	 * Creates dataStore using baseParams and given config
	 * 
	 * @param {Object} options
	 * @returns
	 */
	createStore : function( options )
	{
		var me = this;
		
		Ext.applyIf( options, {
			module : me.name
		});
		
		return me.env.request.createStore( options );
	},
	
	getViewConfig : function()
	{
		return this.config['view'];
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