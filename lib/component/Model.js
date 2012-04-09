/**
 * TODO find better place for this class
 */
Ext.define( 'extAdmin.component.Model',
{
	extend : 'extAdmin.Model',

	statics : {
		ID_FIELD      : 'ID',
		ACTIONS_FIELD : 'actions',

		create : function( fields )
		{
			var modelCfg = {
		    	extend : this.$className,
		    	fields : []
		    };

			// create model
			var modelFields  = modelCfg.fields,
			    idField      = null,
			    actionsField = null,
			    field, item;

			for( var dataIdx in fields ) {
				item  = fields[ dataIdx ];
				field = {
					name : dataIdx
				};

				extAdmin.applyConfigIf( field, {
					defaultValue : item.defaultValue,
					useNull      : item.useNull
				});

				switch( item.type ) {
					case 'ID':
					case 'idcolumn':
						modelCfg.idProperty = dataIdx;
						idField = field;
						break;

					case 'action':
					case 'actioncolumn':
						modelCfg.actionsField = dataIdx;
						actionsField = field;
						break;

					case 'date':
					case 'datecolumn':

					case 'datetime':
					case 'datetimecolumn':
						field.type       = item.dataType   || 'datetime';
						field.dateFormat = item.dateFormat || "Y-m-d H:i:s";
						break;

					case 'currency':
					case 'currencycolumn':
						field.type = 'float';

						if( item.currencyField ) {
							modelFields.push({
								name : item.currencyField,
								type : 'string'
							});
						}
						break;

					default:
						break;
				}

				modelFields.push( field );
			}

			// setup default fields
			var setupDefaultField = function( field, name, defaults ) {
				if( field === null ) {
					//<debug>
					if( fields[ name ] ) {
						Ext.Error.raise({
							msg : 'Can not setup default model field "'+ name +'". Model already contains field with same name.',
							name        : name,
							modelFields : modelFields,
						});
					}
					//</debug>

					field = {
						name : name
					};

					modelFields.push( field );
				}

				Ext.applyIf( field, defaults );
			};

				// ID
				setupDefaultField( idField, this.ID_FIELD, {
					type : 'int'
				});

				// actions
				setupDefaultField( actionsField, this.ACTIONS_FIELD, {} );


			var modelName = this.$className +'.AnonymousModel-'+ Ext.id();

			Ext.define( modelName, modelCfg );

			return modelName;
		}
	},

	actionsField : null,

//    onClassExtended: function( cls, data )
//    {
//    	Ext.Error.raise( 'Component model extension is not implemented yet' );
//
//        if( data.fields == null ) {
//        	data.fields = [];
//        }
//
//        var fields = data.fields;
//
//        // ID field
//        fields.push({ name : 'ID', type : 'int' });
//
//        // actions field
//        fields.push({ name : 'actions' });
//
//        extAdmin.Model.prototype.$onExtended.apply( this, arguments );
//    },

    /**
     * Checks whether given action is allowed for the record
     *
     * @param {String} name Action name
     * @returns {Boolean}
     */
    hasAction : function( name )
    {
    	return Ext.Array.contains( this.get( this.actionsField ), name );
    }
});