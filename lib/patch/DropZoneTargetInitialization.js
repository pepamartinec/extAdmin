/**
 * Tunes Ext.dd.DragDrop 'mousedown' event initialization.
 * 
 *  @author Josef Martinec <joker806@gmail.com>
 */
Ext.define( 'extAdmin.patch.DropZoneTargetInitialization',
{
	override : 'Ext.dd.DragDrop',
	
    /**
     * Sets up the DragDrop object.  Must be called in the constructor of any
     * Ext.dd.DragDrop subclass
     * @param {String} id the id of the linked element
     * @param {String} sGroup the group of related items
     * @param {Object} config configuration attributes
     */
    init: function(id, sGroup, config) {
        this.initTarget(id, sGroup, config);
        Ext.EventManager.on(id, "mousedown", this.handleMouseDown, this);
    },	
});