Ext.define( 'extAdmin.widget.form.ForeingRecord',
{
	extend : 'Ext.form.field.ComboBox',

	alias : 'widget.foreingrecordfield',

	statics : {
		modelName : 'extAdmin.widget.form.ForeingRecord.Model'
	},
	
	name        : null,
	emptyText   : null,
	fetchAction : null,
	autoReload  : true,
	
	initComponent : function()
	{
		var me = this;

		Ext.apply( me, {        
			displayField : 'title',
			valueField   : 'ID',

//			allowBlank     : false,
			editable       : false,
			triggerAction  : 'all',
			queryMode      : 'local',
			forceSelection : true
		});
		
		if( me.store == null ) {
			me.store = {
				autoLoad : false,
				model : me.self.modelName,
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
	}
	
}, function() {
	
	// define data model
	Ext.define( 'extAdmin.widget.form.ForeingRecord.Model', {
		extend : 'extAdmin.Model',
		
		fields : [
			{ name : 'ID' },
			{ name : 'title' }
		]
	});
	
});
