Ext.define( 'extAdmin.action.AbstractAction',
{
	extend : 'Ext.Action',
	
	uses : [
		'extAdmin.ActionManager'
	],
	
	statics : {
		iconsBase : 'images/icons/'
	},
	
	texts : {
		title : 'unknown'
	},
	
	category : null,
	
	/**
	 * @config {extAdmin.Environment} env
	 */
	env : null,
	
	/**
	 * @config {extAdmin.Module|String} module
	 */
	module : null,
	
	/**
	 * @config {String} name
	 */
	name : null,
	
	/**
	 * @config {Object} params
	 */
	params : {},
	
	/**
	 * Run for registration of action classes with extAdmin.ActionManager
	 * 
	 * @param cls
	 * @param data
	 */
    onClassExtended: function( cls, data )
    {    	
    	if( data.isPrototype !== true ) {
    	   	extAdmin.ActionManager.registerActionClass({
    	   		type : cls.$className.split('.').pop().toLowerCase(),
    	   		cls  : cls
    	   	});
    	}
    },
	
    /**
     * Action constructor
     * 
     * @public
     * @param {Object} config
     */
	constructor : function( config )
	{
		var me = this;
		
		me.callParent([{		
			text    : config.title   || me.texts.title,
			iconCls : config.iconCls || me.iconCls,
			handler : me.handler,
			scope   : me
		}]);
		
		var module = config.module,
		    env    = module.env;
		
		Ext.apply( me, {
			env    : env,
			module : env.moduleManager.get( module ),
			name   : config.name,
			params : Ext.Object.merge( {}, me.params, config.params || {} ),
			
			runScope : config.runScope
		});
		
		if( config.runBefore ) {
			me.runBefore = config.runBefore;
		}
		
		if( config.runAfter ) {
			me.runAfter = config.runAfter;
		}
		
		me.initParams( me.params );
	},
	
	/**
	 * Parameters initialization callback
	 * 
	 */
	initParams : Ext.emptyFn,
	
	/**
	 * Returns action icon URL
	 * 
	 * @public
	 * @returns {String}
	 */
	getIconUrl : function()
	{
		return this.icon ? extAdmin.AbstractAction.iconsBase + this.icon : null;
	},
	
	/**
	 * Returns action parameter value
	 * 
	 * @public
	 * @param   {String} name
	 * @returns {Mixed}
	 */
	getParam : function( name )
	{
		return this.params[ nam ];
	},
	
	/**
	 * Returns parameters for handler function
	 * 
	 * @protected
	 * @returns {Array}
	 */
	getRunParams : function()
	{
		return [];
	},
	
	/**
	 * Before action callback
	 * 
	 * @protected
	 */
	runBefore : function( action, cb, cbScope )
	{
		Ext.callback( cb, cbScope );
	},
	
	/**
	 * Action excution body
	 * 
	 * @protected
	 */
	run : extAdmin.abstractFn,
	
	/**
	 * After action callback
	 * 
	 * @protected
	 */
	runAfter : Ext.emptyFn,
	
	/**
	 * Action launch handler
	 * 
	 * @protected
	 */
	handler : function()
	{
		var me = this;
		
		Ext.callback( me.runBefore, me.runScope, [ me, me.afterRunBefore, me ]);
	},
	
	// private
	afterRunBefore : function()
	{
		var me        = this,
		    runParams = me.getRunParams();
		
		runParams.push( me.runAfter, me.runScope );
		
		me.run.apply( me, runParams );
	},
	
	/**
	 * Normalizes module name to absolute form
	 * 
	 * @param  {String} name Module name (relative or absolute)
	 * @return {String} Absolute module name
	 */
	normalizeModuleName : function( name )
	{
		name.replace( '.', '\\' );
		
		if( name.indexOf('\\') === -1 ) {
			var moduleName = this.module.name.split('\\');
			moduleName[ moduleName.length - 1 ] = name;
			
			name = moduleName.join('\\');
		}
		
		return name;
	},
	
	/**
	 * Creates action pointer
	 * 
	 * @param  {String} name Action specification
	 * @param  {extAdmin.Module} defaultModule
	 * @param  {String} defaultAction Action used as implicit one
	 * @return {Array}  Normalized action pointer
	 */
	createAction : function( action, defaultModule, defaultAction )
	{
		var me           = this,
		    targetModule = ( Ext.isArray( action ) && action[0] === '.' ) ? me.module : defaultModule;
	
		return targetModule.normalizeActionPtr( action, defaultAction );
	},
	
	/**
	 * Creates new button attached to the action
	 * 
	 * @public
	 * @param   {Object} options
	 * @returns {Ext.button.Button}
	 */
	createButton : function( options )
	{
		var me = this;
		
		var button = Ext.widget( options.xtype || 'button', Ext.applyIf( options, me ) );
		
		me.addComponent( button );
		
		return button;
	},
	
	/**
	 * Updates action state according to current configuration
	 * 
	 * @public
	 */
	updateState : extAdmin.abstractFn
});