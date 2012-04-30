<?php
namespace ExtAdmin\Response;

/**
 * @author peppino
 *
 *
 */
class cFormResponse extends cResponse
{
	const KEY_CONF = 'formConf';
	
	/**
	 * Creates new response instance
	 *
	 * @param bool  $success
	 * @param array $data
	 * @param int   $total
	 */
	function __construct( $success, array $data )
	{
		parent::__construct( $success );
		
		$this->set( self::KEY_DATA, $data );
	}
	
	/**
	 * Sets form configuration
	 *
	 * @param  array         $conf
	 * @return cFormResponse
	 */
	public function setConf( array $conf )
	{
		$this->set( self::KEY_CONF, $conf );
		return $this;
	}
}