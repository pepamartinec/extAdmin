Ext.define( 'extAdmin.Module',
{
	requires : [
		'extAdmin.Request',
		'inspirio.String',
		'Ext.ClassManager',
		'Ext.Error'
	],
	
	uses : [
		'extAdmin.action.dataBrowser.Filter',
		'extAdmin.action.dataList.Form',
		'extAdmin.action.dataList.Remove',
		'extAdmin.action.dataList.Server',
		'extAdmin.action.dataList.Redirect'
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
		me.config = config;
		
		// init actions
		me.actions = {};
		
		me.initActions( 'module', function( className, actionName, definition ) {
			return Ext.create( className, me, actionName, definition );
		});
		
		// init request
		me.request = Ext.create( 'extAdmin.Request', {
			serverHandle : serverHandle,
			baseParams : {
				module : name
			}
		});
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
			
			var definition = definitions[ actionName ],
			    actionType = inspirio.String.ucfirst( definition.type ),
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