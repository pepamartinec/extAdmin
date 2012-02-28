Ext.define( 'extAdmin.Module',
{
	requires : [
		'extAdmin.ActionManager'
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
	 * Returns module view configuration
	 * 
	 * @returns {Object}
	 */
	getViewConfig : function()
	{
		return this.config['view'];
	},
	
	/**
	 * Returns names of actions available for this module
	 * 
	 * @return {String[]}
	 */
	getActionNames : function()
	{
		return Ext.Object.getKeys( this.config.actions );
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
	 * @param {String[]} actions
	 * @param {Object} config
	 * @return {Object}
	 */
	factoryActions : function( actionNames, config )
	{
		var me         = this,
		    actionsDef = me.config.actions;
		
		Ext.Object.each( config, function( name, category ) {			
			if( Ext.isDefined( category.module ) === false ) {
				category.module = me;
			}
		});
		
		var actions = {};
		Ext.Array.forEach( actionNames, function( name ) {
			if( actionsDef.hasOwnProperty( name ) === false ) {
				return;
			}
			
			actions[ name ] = actionsDef[ name ];
		});
		
		return extAdmin.ActionManager.factoryActions( actions, config );
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
	 * Requests data from server
	 * 
	 * @async
	 * @param {Object} config
	 */
	makeRequest : function( config )
	{
		this.env.request.request( config );
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
	


	/**
	 * Returns module actions
	 * 
	 * @returns {Object}
	 */
	getActions : function()
	{
		return this.actions;
	}
});