Ext.define( 'extAdmin.action.AbstractAction',
{
	extend : 'Ext.Action',
	
	requires : [
	    'extAdmin.action.ActionManager',
	    'extAdmin.ModuleManager'
	],
	
	statics : {
		iconsBase : 'images/icons/'
	},
	
	texts : {
		title : 'unknown'
	},
	
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
	
    onClassExtended: function( cls, data )
    {
    	if( data.alias == null ) {
    		data.alias = [];
    		
    	} else if( Ext.isString( data.alias ) ) {
    		data.alias = [ data.alias ];
    	}
    	
    	var clsNameParts = data.$className.split('.');
    	data.alias.push( 'action.'+ clsNameParts.pop().toLowerCase() );
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
		
		Ext.apply( me, {
			env      : config.env,
			module   : config.env.moduleManager.get( config.module ),
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
	createButton : function( options, type )
	{
		var me = this;
		
		var button = Ext.create( type || 'Ext.button.Button', Ext.applyIf( options, {
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