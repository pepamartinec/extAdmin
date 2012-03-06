Ext.define( 'extAdmin.debug.ConsolePanel',
{
	extend : 'Ext.grid.Panel',
	
	requires : [
		'Ext.data.Store',
		'Ext.data.Model'
	],
	
	/**
	 * @cfg {extAdmin.Environment}
	 */
	env : null,
	
	/**
	 * Panel initialization
	 * 
	 */
	initComponent : function()
	{
		var me = this;
		
		Ext.apply( me, {
			title  : 'Console',
			
			store : Ext.create( 'Ext.data.Store', {
				model : me.$className +'.Model'
			}),
			
			columns : [{
				dataIndex : 'text',
				flex      : 1
			},{
				renderer : function( record ) {
					return record.get('class')+':'+record.get('method');
				}
			}],
			
			dockedItems : [{
				dock  : 'top',
				xtype : 'toolbar',
				items : [{
					xtype   : 'button',
					text    : 'Clear',
					handler : function() {
						me.store.removeAll();
					}
				}]
			}]
		});
		
		me.callParent( arguments );
		
		extAdmin.ErrorHandler.bindHandler( me.error, me );
	},
	
	log : function( message ) {
		var con    = Ext.global.console,
		    level  = 'log',
		    indent = log.indent || 0,
		    dump   = null,
		    stack  = null;

		log.indent = indent;

		if( typeof message != 'string' ) {
			var options = message;
			
			message = options.msg || '';
			level   = options.level || level;
			dump    = options.dump;
			stack   = options.stack;

			if( options.indent ) {
				++log.indent;
				
			} else if( options.outdent ) {
				log.indent = indent = Math.max(indent - 1, 0);
			}
		}

		if( arguments.length > 1 ) {
			message += Array.prototype.slice.call( arguments, 1 ).join('');
		}

		if( indent ) {
			message = Ext.String.repeat( ' ', log.indentSize * indent ) + message;
		}
		
		if( con ) {
			if( con[ level ] ) {
				con[ level ]( message );
				
			} else {
				con.log( message );
			}

			if( dump ) {
				con.dir( dump );
			}

			if( stack && con.trace ) {
				if( !con.firebug || level != 'error' ) {
					con.trace();
				}
			}
		}
	},

	_logWrap : function( level, args ) {
		if( typeof args[0] == 'string' ) {
			args.unshift({});
		}
		
		args[0].level = level;
		
		this.log.apply( this, args );
	},

	error : function () {		
		this._logWrap( 'error', Array.prototype.slice.call( arguments ) );
	},
	
	info : function () {
		this._logWrap( 'info', Array.prototype.slice.call( arguments ) );
	},
	
	warn : function() {
		this._logWrap( 'warn', Array.prototype.slice.call( arguments ) );
	}
	
}, function() {
	
	Ext.define( this.$className +'.Model', {
		extend     : 'Ext.data.Model',
		idProperty : name,
		
		fields : [{
			name : 'message'
		},{
			name : 'level'
		},{
			name : 'dump'
		},{
			name : 'stack'
		},{
			name : 'indent'
		},{
			name : 'outdent'
		}]
	});	
});