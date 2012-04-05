/**
 * Extends Ext.form.field.Date to accept and provide default MySQL date(time) format
 * 
 */
Ext.define( 'extAdmin.DateFieldMysqlFormat', {
	override : 'Ext.form.field.Date',
	
	altFormats : 'Y-m-d H:i:s|'+ Ext.form.field.Date.prototype.altFormats,
	
	submitFormat : 'Y-m-d'
});