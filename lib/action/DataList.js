Ext.define( 'extAdmin.action.DataList',
{
	extend : 'extAdmin.AbstractAction',
	
	multiRow : false,
	dataDep  : true,
	
	dataBrowser : null,
	
	constructor : function( config )
	{
		var me = this;
		
		me.callParent( arguments );
		
		Ext.apply( me, {
			multiRow    : Ext.isDefined( config.multiRow ) ? config.multiRow : me.multiRow,
			dataDep     : Ext.isDefined( config.dataDep )  ? config.dataDep  : me.dataDep,
			dataBrowser : config.dataBrowser
		});
		
		if( me.dataBrowser == null ) {
			console.log(me);
		}
		
		if( me.dataDep ) {
			me.updateState = me.updateState_dataDep;
			
		} else {
			me.updateState = me.updateState_dataIndep;
		}
	},
	
	updateState_dataIndep : function()
	{
		this.setDisabled( false );
	},
	
	updateState_dataDep : function()
	{
		var me = this,
		    isDisabled = true,
		    dataList   = me.dataBrowser.getDataList();
		
		if( dataList != null ) {		
			var selModel = me.dataBrowser.getDataList().getSelectionModel(),
			    records  = selModel.getSelection(),
			    active   = 0;
			
			isDisabled = me.dataDep;
			
			if( isDisabled && records.length > 0 && ( records.length == 1 || me.multiRow == true ) ) {	
				for( var i = 0, rl = records.length; i < rl; ++i ) {
					if( records[i].data['actions'].indexOf( me.name ) >= 0 ) {
						++active;
					}
				}
				
				isDisabled = active < records.length;
			}
		}
		
		me.setDisabled( isDisabled );
	},
	
	isMultiRow : function()
	{
		return this.multiRow;
	},
	
	isDataDependant : function()
	{
		return this.dataDep;
	}
});