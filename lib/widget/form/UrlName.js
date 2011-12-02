Ext.define( 'extAdmin.widget.form.UrlName',
{
	extend : 'Ext.form.field.Text',

	alias : [
		'widget.urlnamefield',
		'widget.urlfield'
	],
	
	/**
	 * Source field ref
	 * 
	 * @required
	 * @cfg {Ext.form.field.Text}
	 */
	sourceField : null,
	
	/**
	 * Component initialization
	 * 
	 * @private
	 */
    initComponent: function()
    {
    	var me = this;
    	
    	Ext.apply( me, {
//			readOnly : true,
    		name     : 'urlName'
    	});
    	
    	if( me.sourceField ) {
    		me.sourceField.on({
    			scope : me,
    			
    			blur  : me.generate,
    			keyup : me.generate
    		});
    	}
    	
    	me.callParent();
	},
	
	/**
	 * Sets source field
	 * 
	 * @param {Ext.form.field.Text} source
	 */
	setSourceField : function( source )
	{
		if( this.sourceField != null ) {
			this.sourceField.un( 'blur', this.generate );
		}		
		
		this.sourceField = source;
		this.sourceField.on( 'blur', this.generate, this );
	},
	
	/**
	 * Regenerates field value
	 * 
	 */
	generate : function()
	{
		this.setValue( this.getRidOfBadCharacters( this.sourceField.getValue() ) );
	},
	
	/**
	 * Removes un-safe characters from given string
	 * 
	 * @private
	 * @param {String} text
	 * @return {String}
	 */
	getRidOfBadCharacters : function( text )
	{
		if( !text ) {
			return '';
		}
		
		var badChars="áäčďéěíĺľňóôőöŕšťúůűüýřžÁÄČĎÉĚÍĹĽŇÓÔŐÖŔŠŤÚŮŰÜÝŘŽèÈ -/.,?+<>:;{}()!'\"\\®";
		var goodChars="aacdeeillnoooorstuuuuyrzaacdeeillnoooorstuuuuyrzee---";
		var newString="";
		
		text = text.replace( /^\s*|\s*$/g, "" );
		for( var i = 0; i<text.length; i++ ) { 
			if (badChars.indexOf(text.charAt(i))!=-1) {
			//when replacing bad characters for good one, we have to check if the last
			//replaced character wasn't "-" so that we are not going to have two or more
			// "-" in a row. 
				if((goodChars.charAt(badChars.indexOf(text.charAt(i)))!='-')||(newString.substring(newString.length-1, newString.length)!='-')) {
					newString+=goodChars.charAt(badChars.indexOf(text.charAt(i)));
				}
				
			} else {
				newString+=text.charAt(i);
			}
		}
		
		//lowercase
		return newString.toLowerCase();
	}
	
});
