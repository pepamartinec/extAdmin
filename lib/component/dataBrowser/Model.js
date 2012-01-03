Ext.define( 'extAdmin.component.dataBrowser.Model',
{
	extend : 'extAdmin.Model',
	
	statics : {
		ACTIONS_FIELD : 'actions'
	},
	
	idProperty : 'ID',
	
	fields : [
		{ name : 'ID', type : 'int' },
		{ name : 'actions' },
	],
	
    onClassExtended: function( cls, data )
    {
        if( data.fields == null ) {
        	data.fields = [];
        }
        
        var fields = data.fields;
        
        // ID field
        fields.push({ name : 'ID', type : 'int' });
        
        // actions field
        fields.push({ name : 'actions' });
        
        extAdmin.Model.prototype.$onExtended.apply( this, arguments );
        
    },
    
    hasAction : function( name )
    {
    	Ext.Array.indexOf( name, this.get( this.statics.ACTIONS_FIELD ) ) >= 0;
    }
});