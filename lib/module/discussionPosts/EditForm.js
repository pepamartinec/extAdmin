Ext.define( 'extAdmin.module.discussionPosts.EditForm',
{
	extend : 'extAdmin.component.form.Form',
	
	initComponent : function()
	{
		var titleField = Ext.create( 'Ext.form.field.Text', {
			xtype      : 'textfield',
			fieldLabel : 'Název',
			name       : 'title',
			allowBlank : false
		});
		
		
		
			this.items = [{
				xtype: 'hidden',
				name: 'ID'
			},
			{
				xtype: 'hidden',
				name: 'threadType'
			},
			{
				xtype: 'hidden',
				name: 'parentID'
			},
			titleField,
			{
				fieldLabel: 'Autor',
				name: 'authorName',
				xtype: 'textfield'
			},
			{
				fieldLabel: 'Email',
				name: 'authorEmail',
				xtype: 'textfield'
			},
			{
				xtype      : 'textarea',
				fieldLabel : 'Obsah',
				name       : 'content'
			}];
		
		Ext.apply( this, {
			title : 'Diskusní příspěvek',
			bodyPadding: 5
		});
		
		this.callParent();
	}
});