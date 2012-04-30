<?php
namespace ExtAdmin\Response;

use ExtAdmin\ModuleInterface;

use ExtAdmin\ResponseInterface;

class HtmlResponse extends AbstractResponse
{

	/**
	 * @var string
	 */
	private $content;

	/**
	 * Creates new CSS response instance
	 *
	 * @param string $content stylesheet content
	 */
	public function __construct( $content )
	{
		parent::__construct( self::S_OK );

		$this->content = $content;
		$this->setHeader( 'Content-Type', 'text/html' );
	}

	/**
	 * Builds response content
	 *
	 * @param ModuleInterface $module
	 * @return string
	 */
	protected function buildContent( ModuleInterface $module )
	{
		return $this->content;
	}

}