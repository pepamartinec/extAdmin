<?php
namespace ExtAdmin;

interface DataResponseInterface extends ResponseInterface
{
	const S_OK             = 200;
	const S_BAD            = 400;
	const S_UNAUTHORIZED   = 401;
	const S_INVALID_ACTION = 405;
	const S_EXCEPTION      = 500;

	/**
	 * Prepares data for sending to a client
	 *
	 * @param  ModuleInterface $module
	 * @return string
	 */
	public function encode( ModuleInterface $module );

	/**
	 * Sets response status code
	 *
	 * @param  int $code
	 * @return ResponseInterface
	 */
	public function setStatus( $code );

	/**
	 * Returns complete HTTP status code (including text description)
	 *
	 * @return string
	 */
	public function getHTTPStatus();

	/**
	 * Sets success flag
	 *
	 * @param  bool $success
	 * @return ResponseInterface
	 */
	public function setSuccess( $success );

	/**
	 * Returns success flag state
	 *
	 * @return bool
	 */
	public function getSuccess();

	/**
	 * Sets message
	 *
	 * @param  string $message
	 * @return ResponseInterface
	 */
	public function setMessage( $message );

	/**
	 * Fills response data
	 *
	 * @param  array $data
	 * @return ResponseInterface
	 */
	public function setData( array $data );
}