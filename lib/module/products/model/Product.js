Ext.define( 'extAdmin.module.products.model.Product',
{
	extend : 'extAdmin.Model',
	
	fields : [
		{ name : 'ID',                type : 'int', useNull : true },
		{ name : 'categoryID',        type : 'int', useNull : true },
		{ name : 'title',             type : 'string' },
		{ name : 'urlName',           type : 'string' },
		{ name : 'perex',             type : 'string' },
		{ name : 'content',           type : 'string' },
		{ name : 'keywords',          type : 'string' },
		{ name : 'description',       type : 'string' },
		{ name : 'publish',           type : 'boolean' },
		{ name : 'modelSeries',       type : 'string' },
		{ name : 'language',          type : 'string' },
		{ name : 'localizations',     type : 'string' },
		{ name : 'vendorID',          type : 'int', useNull : true },
		{ name : 'manufacturerID',    type : 'int', useNull : true },
		{ name : 'manufactoringCost', type : 'float', useNull : true },
		{ name : 'warranty',          type : 'string' },
		{ name : 'albumID',           type : 'int', useNull : true },
		{ name : 'titleImageID',      type : 'int', useNull : true },
		{ name : 'vatRateID',         type : 'int', useNull : true },
		{ name : 'vatRateValue',      type : 'float', useNull : true },
		{ name : 'purchasePrice',     type : 'float', useNull : true },
		{ name : 'recommendedPrice',  type : 'float', useNull : true },
		{ name : 'sellPrice',         type : 'float', useNull : true },
		{ name : 'actionPrice',       type : 'float', useNull : true },
		{ name : 'saleType',          type : 'string' },		
		{ name : 'createdBy',         type : 'int', useNull : true },
		{ name : 'createdOn',         type : 'date' },
		{ name : 'editedBy',          type : 'int', useNull : true },
		{ name : 'editedOn',          type : 'date' },
	],
	
	getFinalPrice : function( applyVat )
	{
		var price = this.get( 'actionPrice' );
		
		if( price === null ) {
			price = this.get( 'sellPrice' );
		}
		
		if( applyVat !== false ) {
			price = ( this.get( 'vatRateValue' ) * 0.01 + 1 ) * price;
		}
		
		return price;
	}
});