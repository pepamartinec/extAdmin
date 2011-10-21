Ext.define( 'extAdmin.component.RepositoryBrowser',
{
	extend : 'Ext.panel.Panel',
	
	requires : [
		'extAdmin.widget.FilesList',
		'extAdmin.ModuleManager',
		'extAdmin.popup.FileUpload',
		'Ext.toolbar.Toolbar',
		'Ext.button.Button'
	],
	
	alias : [
		'widget.repositorybrowser',
		'lookup.repository'
	],
	
	mixins : {
		lookup : 'extAdmin.component.feature.Lookup'
	},
	
	texts : {
		uploadBtn : 'Nahrát nové'
	},
	
	/**
	 * Module
	 * 
	 * @cfg {String|extAdmin.Module} module
	 */
	module : 'repositoryBrowser',
	
	/**
	 * Records load action name
	 * 
	 * @cfg {String} loadAction
	 */
	loadAction : 'getItems',
	
	/**
	 * Items load action parameters
	 * 
	 * @cfg {Object|Null} loadParams
	 */
	loadParams : null,
	
	/**
	 * Allows selecting more items at one time
	 * 
	 * @cfg {Boolean}
	 */
	multiSelect : true,
	
	/**
	 * Configuration for {@link extAdmin.popup.FileUpload upload popup}.
	 * If nothing given, upload button will be disabled
	 * 
	 * @cfg {Object}
	 */
	uploadPopup : undefined,
	
	/**
	 * When supplied, the model is used as model for returned items
	 * 
	 * @cfg {String|Null}
	 */
	modelName : 'extAdmin.widget.FilesList.Model',
	
	/**
	 * Component intialization
	 * 
	 * @protected
	 */
	initComponent : function()
	{
		var me = this;
		
		// apply default module config
		me.module = extAdmin.ModuleManager.get( me.module || me.self.defaultModule );
		me.loadAction = me.loadAction || me.self.defaultAction;
		me.loadParams = me.loadParams || {};
		
		// create list
		me.list = Ext.create( 'extAdmin.widget.FilesList', {
			module        : me.module,
			loadAction    : me.loadAction,
			loadParams    : me.loadParams,
			multiSelect   : me.multiSelect,
			modelName     : me.modelName,
		});
		me.list.store.load();
		
		// setup popup button
		if( me.uploadPopup === undefined ) {
			me.uploadPopup = {
				module       : 'repository',
				submitAction : 'uploadFiles'
			};
		}
		
		if( me.uploadPopup !== null ) {
			me.dockedItems = [{
				xtype : 'toolbar',
				dock  : 'bottom',
				items : [{
					xtype : 'button',
					text  : me.texts.uploadBtn,
					listeners : {
						scope : me,
						click : me.showUploadPopup
					}
				}]
			}];
		}
		
		Ext.apply( me, {
			layout : 'fit',
			items  : [ me.list ]
		});
		
		me.callParent( arguments );
		me.mixins.lookup.constructor.call( me, {
			selModel : me.list.getSelectionModel()
		});
	},
	
	/**
	 * Shows upload popup
	 * 
	 * @protected
	 */
	showUploadPopup : function()
	{
		if( this.popup == null ) {
			Ext.apply( this.uploadPopup, {
				closeAction     : 'hide',
				resultsCallback : this.handleUploadedFiles,
				resultsScope    : this				
			});
			
			this.popup = Ext.create( 'extAdmin.popup.FileUpload', this.uploadPopup );
		}
		
		var storeFilters = this.list.getStore().filters,
		    uploadFilters = {};
		
		for( var i = 0, sl = storeFilters.length; i < sl; ++i ) {
			var filter = storeFilters.get( i );
			
			uploadFilters[ filter.property ] = filter.value;
		}
		
		this.popup.show( uploadFilters );
	},
	
	/**
	 * Handles newly uploaded files
	 * 
	 * @private
	 * @param success
	 * @param uploadedFiles
	 */
	handleUploadedFiles : function( success, uploadedFiles )
	{
		if( success == false ) {
			return;
		}
		
		this.list.getStore().load();
		this.popup.hide();
	},
	
	/**
	 * Returns underlying data-store
	 * 
	 * @return {Ext.data.Store}
	 */
	getStore : function()
	{
		return this.list.getStore();
	},
	
	/**
	 * Returns underlying selection model
	 * 
	 * @return {Ext.selection.Model}
	 */
	getSelectionModel : function()
	{
		return this.list.getSelectionModel();
	}
});