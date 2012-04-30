<?php
namespace ExtAdmin\Response;

use ExtAdmin\ModuleInterface;
use ExtAdmin\ResponseInterface;

class ActionResponse extends AbstractResponse
{
	const KEY_SUCCESS = 'success';
	const KEY_MESSAGE = 'message';
	const KEY_DATA    = 'data';

	/**
	 * @var array
	 */
	private $content;

	/**
	 * Creates new response instance
	 *
	 * @param bool $success
	 */
	function __construct( $success )
	{
		parent::__construct( self::S_OK );

		$this->setHeader( 'Content-Type', 'application/json; charset=utf-8' );
		$this->content[ self::KEY_SUCCESS ] = $success;
	}

	/**
	 * Universal content items setter
	 *
	 * @param string $item
	 * @param mixed  $data
	 */
	protected function set( $item, $data )
	{
		$this->content[ $item ] = $data;
	}

	/**
	 * Universal content items getter
	 *
	 * @param string $item
	 */
	protected function get( $item )
	{
		return $this->content[ $item ];
	}

	/**
	 * Sets the response success flag
	 *
	 * @param  bool $success
	 * @return ActionResponse
	 */
	public function setSuccess( $success )
	{
		$this->set( self::KEY_SUCCESS, $success );
		return $this;
	}

	/**
	 * Returns the success flag state
	 *
	 * @return bool
	 */
	public function getSuccess()
	{
		return $this->get( self::KEY_SUCCESS );
	}

	/**
	 * Sets the response message
	 *
	 * @param  string $message
	 * @return Response
	 */
	public function setMessage( $message )
	{
		$this->set( self::KEY_MESSAGE, $message );
		return $this;
	}

	/**
	 * Returns the message
	 *
	 * @return string
	 */
	public function getMessage()
	{
		return $this->get( self::KEY_MESSAGE );
	}

	/**
	 * Fills the response data
	 *
	 * @param  array $data
	 * @return Response
	 */
	public function setData( array $data )
	{
		$this->content[ self::KEY_DATA ] = $data;
		return $this;
	}

	/**
	 * Returns the data
	 *
	 * @return array
	 */
	public function getData()
	{
		return $this->get( self::KEY_DATA );
	}

	/**
	 * Builds the response content
	 *
	 * @param ModuleInterface $module
	 * @return string
	 */
	protected function buildContent( ModuleInterface $module )
	{
		return json_encode( $this->content );
	}
}