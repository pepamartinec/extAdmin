<?php
namespace ExtAdmin\Response;

use ExtAdmin\ModuleInterface;

class FileResponse extends AbstractResponse
{
	/**
	 * @var string
	 */
	protected $filename;

	/**
	 * Creates new CSS response instance
	 *
	 * @param string $content stylesheet content
	 */
	public function __construct( $filename )
	{
		parent::__construct( self::S_OK );

		$this->filename = $filename;
	}

	/**
	 * Sets the filename
	 *
	 * @param string $filename
	 * @return FileResponse
	 */
	public function setFilename( $filename = null )
	{
		$this->filename = $filename;
		return $this;
	}

	/**
	 * Builds response content
	 *
	 * @param ModuleInterface $module
	 * @return string
	 */
	protected function buildContent( ModuleInterface $module )
	{
//		$filename = PATH_TO_WEBSERVER_ROOT . PATH_FROM_ROOT_TO_BASE . $this->filename;
		$filename = $this->filename;

		// invalid file
		if( ! is_file( $filename ) ) {
			$this->setStatus( self::S_NOT_FOUND );
			return false;
		}

		// check the modification time
		$modificationTime = new \DateTime( '@'.filemtime( $filename ) );

		// check the ifModifiedSince header
		if( isset( $_SERVER['HTTP_IF_MODIFIED_SINCE'] ) ) {
			$ifModified = \DateTime::createFromFormat( \DateTime::RFC2822, $_SERVER['HTTP_IF_MODIFIED_SINCE'] );

			if( $ifModified !== false && $ifModified >= $modificationTime ) {
				$this->setStatus( self::S_NOT_MODIFIED );
				return false;
			}

		} else {
			$this->setHeader( 'Last-Modified', $modificationTime->format('r') );
		}

		// set the mime-type
		$finfo    = finfo_open( FILEINFO_MIME_TYPE );
		$mimeType = finfo_file( $finfo, $filename );
		$this->setHeader( 'Content-Type', $mimeType );

		// set the contentLength header
		$this->setHeader( 'Content-Length', filesize( $filename ) );

		// serve the file
		$this->setHeader( 'Content-Disposition', 'filename='. basename( $filename ) );

		return $filename;
	}

	protected function sendContent( $filename )
	{
		if( ! $filename ) {
			return;
		}

		readfile( $filename );
	}
}