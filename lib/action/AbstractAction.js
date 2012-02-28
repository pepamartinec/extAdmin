Ext.define( 'extAdmin.action.AbstractAction',
{
	extend : 'Ext.Action',
	
	requires : [
//		'extAdmin.ActionManager'
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
	 * Handler for registration of action classes with extAdmin.ActionManager
	 * 
	 * @param cls
	 * @param data
	 */
    onClassExtended: function( cls, data )
    {    	
    	if( data.isPrototype !== true ) {
    	   	extAdmin.ActionManager.registerActionClass({
    	   		type     : cls.$className.split('.').pop().toLowerCase(),
    	   		cls      : cls
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
		var me  = this,
		    env = config.module.env;
		
		me.callParent([{		
			text    : config.title   || me.texts.title,
			iconCls : config.iconCls || me.iconCls,
			handler : me.handler,
			scope   : me
		}]);
		
		Ext.apply( me, {
			env      : env,
			module   : env.moduleManager.get( config.module ),
			name     : config.name,
			params   : Ext.Object.merge( {}, me.params, config.params || {} )
		});
	},
	
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
	getHandlerParams : function()
	{
		return [];
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
		
		var button = Ext.widget( options.xtype || 'button', Ext.applyIf( options, {
			iconCls : me.getIconCls(),
			text    : me.getText(),
			
			handler : function( btn, e ) {
				me.handler.apply( me, me.getHandlerParams() );
			}
		}) );
		
		me.addComponent( button );
		
		return button;
	},
	
	/**
	 * Updates action state according to current configuration
	 * 
	 * @public
	 */
	updateState : extAdmin.abstractFn,
	
	/**
	 * Action launch handler
	 * 
	 * @protected
	 */
	handler : extAdmin.abstractFn
});