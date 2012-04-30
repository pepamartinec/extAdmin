<?php
namespace ExtAdmin\Response;

use ExtAdmin\ModuleInterface;
use ExtAdmin\ResponseInterface;

abstract class AbstractResponse implements ResponseInterface
{
	/**
	 * HTTP status code
	 *
	 * @var int
	 */
	private $status;

	/**
	 * List of response HTTP headers
	 *
	 * @var array
	 */
	private $headers;

	/**
	 * Constructor
	 *
	 * @param int $status
	 */
	public function __construct( $status )
	{
		$this->status  = $status;
		$this->headers = array();
	}

	/**
	 * Sets response status code
	 *
	 * @param  int $code
	 * @return ResponseInterface
	 */
	public function setStatus( $code )
	{
		$this->status = $code;
		return $this;
	}

	/**
	 * Returns response HTTP status
	 *
	 * @param bool $full if true, full status (code + description) is returned
	 * @return int|string
	 */
	public function getStatus( $full = false )
	{
		if( $full !== true ) {
			return $this->status;
		}

		switch( $this->status ) {
			case self::S_OK:             return '200 OK';
			case self::S_NOT_MODIFIED:   return '304 Not Modified';
			case self::S_BAD:            return '400 Bad Request';
			case self::S_UNAUTHORIZED:   return '401 Unauthorized';
			case self::S_NOT_FOUND:      return '404 Not Found';
			case self::S_INVALID_ACTION: return '405 Method Not Allowed';
			case self::S_EXCEPTION:      return '500 Internal Server Error';
			default: throw new xInvalidStatusException( $this->status );
		}
	}

	/**
	 * Sets response header
	 *
	 * Existing headers are overwritten.
	 *
	 * @param string $header
	 * @param string $value
	 * @return ResponseInterface
	 */
	public function setHeader( $header, $value )
	{
		if( $value === null ) {
			if( isset( $this->headers[ $header ] ) ) {
				unset( $this->headers[ $header ] );
			}

		} else {
			$this->headers[ $header ] = (string)$value;
		}

		return $this;
	}

	/**
	 * Returns header value
	 *
	 * @param string|null $header
	 */
	public function getHeader( $header )
	{
		if( isset( $this->headers[ $header ] ) ) {
			return $this->headers[ $header ];

		} else {
			return null;
		}
	}

	/**
	 * Disables browser & proxy chahing of the response
	 *
	 * @return AbstractResponse
	 */
	public function disableCache()
	{
		$this->setHeader( 'Expires',       gmdate( 'D, d M Y H:i:s', 0 ).' GMT' )
		     ->setHeader( 'Last-Modified', gmdate( 'D, d M Y H:i:s' ).' GMT' )
		     ->setHeader( 'Cache-Control', 'no-cache, must-revalidate' )
		     ->setHeader( 'Pragma',        'no-cache' );

		return $this;
	}

	/**
	 * Sets Last-Modified header
	 *
	 * @param int|DateTime $date
	 * @return AbstractResponse
	 */
	public function setLastModified( $date )
	{
		$format  = 'D, d M Y H:i:s e';
		$dateStr = null;

		if( $date instanceof \DateTime ) {
			/* @var $date \DateTime */
			$date->setTimezone( new DateTimeZone('UTC') );
			$dateStr = $date->format( $format );

		} else {
			$dateStr = gmdate( $format, $date );
		}

		$this->setHeader( 'Last-Modified', $dateStr );

		return $this;
	}

	/**
	 * Prepares data for sending to a client
	 *
	 * @param  ModuleInterface $module
	 * @return string
	 */
	public final function send( ModuleInterface $module )
	{
		$content = $this->buildContent( $module );

		$this->sendHeaders();
		$this->sendContent( $content );
	}

	/**
	 * Sends the response headers to the client
	 *
	 */
	protected function sendHeaders()
	{
		// output the status
		header( 'HTTP/1.1 '.$this->getStatus( true ) );

		// output other headers
		foreach( $this->headers as $header => $value ) {
			header( "{$header}: $value" );
		}

		flush();
	}

	/**
	 * Sends the response content to the client
	 *
	 * @param string $content
	 */
	protected function sendContent( $content )
	{
		echo $content;
		flush();
	}

	/**
	 * Builds response content
	 *
	 * @param ModuleInterface $module
	 * @return string
	 */
	abstract protected function buildContent( ModuleInterface $module );
}