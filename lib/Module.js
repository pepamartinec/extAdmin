Ext.define( 'extAdmin.Module',
{
	requires : [
		
	],
	
	uses : [
		'extAdmin.action.*'
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
	 * Returns application environment
	 * 
	 * @returns {extAdmin.Environment}
	 */
	getEnvironment : function()
	{
		return this.env;
	},
	
	/**
	 * Creates module view component
	 * 
	 * @param   {Object} config
	 * @returns
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