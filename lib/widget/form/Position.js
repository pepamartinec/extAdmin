Ext.define( 'extAdmin.widget.form.Position',
{
	extend : 'Ext.form.field.ComboBox',

	alias : 'widget.positionfield',

	statics : {
		modelName : 'extAdmin.widget.form.Position.Model'
	},
	
	texts : {
		choosePosition : 'Vyberte pozici'
	},
	
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
            name : 'position',
            
            displayField : 'title',
            valueField   : 'ID',
            
            blankText      : me.texts.choosePosition,
            allowBlank     : false,
            editable       : false,
            triggerAction  : 'all',
            queryMode      : 'local',
            forceSelection : false,
            
            store : {
            	autoLoad : false,
				model : me.self.modelName,
				proxy : {
					type : 'ajax',
					url  : me.module.buildUrl({
						request : 'form',
						name    : 'editForm',
						action  : 'getPositions'
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
			}
		});
		
		me.callParent();
		
		me.upDelayed( 'form', function( form ) {
			me.form = form;
			me.form.on( 'actioncomplete', me.refreshStore, me );
		});
	},
	
	refreshStore : function()
	{
		var me = this,
		    store = me.store;
		
		store.load({
			params   : me.form.getValues(),
			callback : function() {
				var min   = store.first(),
				    max   = store.last(),
				    value = me.getValue();
				
				if( value < min.get('ID') || value > max.get('ID') ) {
					value = max.get('ID');
				}
				
				me.setValue( value );
				me.clearInvalid();
			}
		});
	}
	
}, function() {
	
	// define data model
	Ext.define( this.modelName, {
		extend : 'extAdmin.Model',
		
		fields : [
			{ name : 'ID' },
			{ name : 'title' }
		]
	});
	
});
