Ext.define( 'extAdmin.popup.ActionRun',
{
	extend : 'Ext.window.Window',
	
	message : null,
	
	constructor : function( config )
	{
		var me = this;
		
		me.initConfig( config );
		me.callParent( arguments );
	},
	
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
			closable  : false,
			resizable : false,
			modal     : true,
			constrain : true,
			plain     : true,
		//	border    : false,
			
			width       : 300,
			bodyPadding : 10
		});
		
		me.callParent();
	},
	
	showProgress : function( message )
	{
		var me = this;
		
		me.suspendLayouts();
		
		// remove any previous content
		me.removeAll( true );
		
		// create & insert progress bar
		var pb = Ext.create( 'Ext.ProgressBar' );
		
		me.add( pb );
		pb.wait({
			text : message
		});
		
		me.resumeLayouts();
		me.show();
	},
	
	showResult : function( result )
	{
		var me = this;
		
		me.suspendLayouts();
		
		// remove any previous content
		me.removeAll( true );
		
		// create & insert message box
		var mb = Ext.create( 'Ext.form.field.Display', {
			value : result.message
		});
		
		me.add( mb );
		
		me.resumeLayouts();
		me.show();
	}
});