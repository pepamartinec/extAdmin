Ext.define( 'extAdmin.ActionManager',
{
	requires : [
		'Ext.Error'
	],
	
	uses : [		
		'extAdmin.action.module.Redirect',
		
		'extAdmin.action.record.Create',
		'extAdmin.action.record.Edit',
		'extAdmin.action.record.Delete',
		'extAdmin.action.record.Server'
	],
	
	singleton : true,
	
	actions : null,
	
	constructor : function()
	{
		var me = this;
		
		me.actions = {};
	},
	
	/**
	 * 
	 * @param opts
	 */
	registerActionClass : function( opts )
	{		
		this.actions[ opts.type ] = opts.cls;
	},
	
	/**
	 * 
	 * @param {Object} actionsDef
	 * @param {Object} factoryConfig
	 * @returns
	 */
	factoryActions : function( actionsDef, factoryConfig )
	{
		var me        = this,
		    actions   = {},
		    intercept = {
				runBefore : factoryConfig.runBefore,
			    runAfter  : factoryConfig.runAfter,
			    runScope  : factoryConfig.runScope
			};
		
		for( var name in actionsDef ) {
			if( actionsDef.hasOwnProperty( name ) === false ) {
				continue;
			}
			
			var actionDef = actionsDef[ name ];
			
			if( Ext.isObject( actionDef ) === false ) {
				continue;
			}
			
			var type = actionDef.type,
			    cls  = me.actions[ type ];
			
			if( cls === undefined ) {
				Ext.Error.raise({
					msg : 'Invalid action type "'+ type +'"',
					actionDef     : actionDef,
					factoryConfig : factoryConfig
				});
			}
			
			var factoryDef = factoryConfig[ cls.prototype.category ];
			
			if( factoryDef === undefined ) {
				Ext.Error.raise({
					msg : 'Missing factory configuration for "'+ cls.category +'" actions category',
					actionDef     : actionDef,
					factoryConfig : factoryConfig
				});
			}
			
			var config = Ext.Object.merge( { name : name }, intercept, factoryDef, actionDef );
			
			actions[ name ] = new cls( config );
		}
		
		return actions;
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
});