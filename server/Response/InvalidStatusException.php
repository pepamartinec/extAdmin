<?php
namespace ExtAdmin\Response;

class xInvalidStatusException extends xResponseException
{
	/**
	 * Constructor
	 *
	 * @param int $code invalid code
	 */
	public function __construct( $code )
	{
		parent::__construct( "Invalid status code '{$code}' set" );
	}
}