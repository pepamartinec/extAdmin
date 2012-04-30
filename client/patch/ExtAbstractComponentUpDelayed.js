/**
 * Implementation of Ext.AbstractComponent.upDelayed() method
 * 
 */
Ext.define( 'extAdmin.ExtAbstractComponentUpDelayed', {
	override : 'Ext.AbstractComponent',
	
	/**
	 * Similiar to {@link Ext.AbstractComponent#up}, but instead of walking up
	 * the `ownerCt` axis immediately, it waits till the component is inserted
	 * into its owner.
	 * 
	 * @param {String} [selector] The simple selector to test.
	 * @param {Function} [cb] The function to call when selector test passes.
	 * @param {Mixed} [cbScope] The callback scope.
	 */
	upDelayed : function( selector, cb, cbScope )
	{
		var result = this;

		while( result.ownerCt ) {
			result = result.ownerCt;
			
			if( selector == null || Ext.ComponentQuery.is( result, selector ) ) {
				Ext.callback( cb, cbScope, [ result ] );
				return;
			}
		}
		
		result.on({
			single : true,
			scope  : this,
			
			added : function() {
				result.upDelayed( selector, cb, cbScope );
			}
		});
	}
});