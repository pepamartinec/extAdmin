Ext.define( 'extAdmin.widget.form.ForeingRecord',
{
	extend : 'Ext.form.field.ComboBox',

	alias : 'widget.foreingrecordfield',
	
	module      : null,
	name        : null,
	emptyText   : null,
	fetchAction : null,
	preload     : false,
	autoReload  : true,
	
	fields         : null,
	idFieldName    : 'ID',
	titleFieldName : 'title',
	
	initComponent : function()
	{
		var me = this;
		
		// define data model
		var fields = me.fields || [
			{ name : 'ID' },
			{ name : 'title' }
		];
		
		var modelName = 'extAdmin.widget.form.ForeingRecord.AnonymousModel-'+ Ext.id();
		
		Ext.define( modelName, {
			extend     : 'extAdmin.Model',
			fields     : fields,
			idProperty : me.idFieldName
		});

		Ext.apply( me, {        
			displayField : me.titleFieldName,
			valueField   : me.idFieldName,

//			allowBlank     : false,
			editable       : false,
			triggerAction  : 'all',
			queryMode      : 'local',
			forceSelection : true
		});
		
		if( me.store == null ) {
			if( me.data ) {
				me.store = {
					model         : modelName,
					implicitModel : true,
					data          : me.data
				};
				
				me.autoReload = false;
				delete me.data;
				
			} else {
				me.module = extAdmin.ModuleManager.get( me.module );
				
				me.store = {
					autoLoad      : me.preload,
					model         : modelName,
					implicitModel : true,
					
					proxy : {
						type : 'ajax',
						url  : me.module.buildUrl({
							request : 'form',
							name    : 'editForm',
							action  : me.fetchAction
						}),
						
						actionMethods: {
							read    : 'POST',
							create  : 'POST',
							update  : 'POST',
							destroy : 'POST'
						},
	
						reader : {
							idProperty      : 'ID',
							messageProperty : 'message',
							successProperty : 'success',
							totalProperty   : 'total',
							root            : 'data'
						}
					}
				};
			}			
		}
		
		me.callParent( arguments );
		
		me.upDelayed( 'form', function( form ) {
			me.form = form;
			
			if( me.autoReload ) {
				me.form.on( 'actioncomplete', me.refreshStore, me );
			}
		});
	},
	
	refreshStore : function()
	{
		var me = this,
		    store = me.store;
		
		store.load({
			params   : me.form.getValues(),
			callback : function() {				
				me.setValue( me.getValue() );
				me.clearInvalid();
			}
		});
	},
	
	getStore : function() 
	{
		return this.store;
	},
	
	setValue : function( values )
	{
		var me = this,
		    store       = me.getStore(),
		    validValues = [];
		
		var actualValue,
		    comparator = function( record ) { return record === actualValue; },
		    pushValue = function( value ) {
		    	actualValue = value;
		    	var isValid;
		    	
		    	if( Ext.isObject( value ) ) {
		    		value = store.findBy( comparator ) != -1 ? value : null;
		    		
		    	} else {
		    		value = store.findRecord( me.idFieldName, value );
		    	}
		    	
		    	if( value ) {
		    		validValues.push( value );
		    	}
		    };
		    
		if( Ext.isArray( values ) ) {			
			for( var i = 0, vl = values.length; i < vl; ++i ) {
				pushValue( values[ i ] );
			}
			
		} else if( values ) {
			pushValue( values );
			
		}
		
		if( validValues.length === 0 && me.allowBlank !== true ) {
			validValues.push( store.first() );
		}
		
		me.callParent([ validValues ]);
	}
	
});
