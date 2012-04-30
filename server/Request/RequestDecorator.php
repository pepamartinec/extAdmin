<?php
namespace ExtAdmin\Request;

use ExtAdmin\RequestInterface;

class RequestDecorator implements RequestInterface
{	
	/**
	 * Original (decorated) request
	 *
	 * @var RequestInterface
	 */
	protected $request;
	
	/**
	 * Constructor
	 *
	 * @param RequestInterface $request
	 */
	public function __construct( RequestInterface $request )
	{
		$this->request = $request;
	}
	
	/**
	 * Returns requested module name
	 *
	 * @return string
	 */
	public function getModuleName()
	{
		return $this->request->getModuleName();
	}
	
	/**
	 * Returns requested action name
	 *
	 * @return string
	 */
	public function getActionName()
	{
		return $this->request->getActionName();
	}
	
	
	
	/**
	 * Tests whether given parameter exists
	 *
	 * @param string $name parameter name
	 */
	public function hasParameter( $name )
	{
		return $this->request->hasParameter( $name );
	}
	
	/**
	 * Returns unsecured (raw) parameter
	 *
	 * @param  string $name parameter name
	 * @return mixed
	 */
	public function getRawParameter( $name )
	{
		return $this->request->getRawParameter( $name );
	}
	
	/**
	 * Returns secured parameter
	 *
	 * @param  string $name parameter name
	 * @param  string $type parameter type
	 * @return mixed
	 */
	public function getParameter( $name, $type )
	{
		return $this->request->getParameter( $name, $type );
	}
	
	
	
	/**
	 * Tests whether given data item exists
	 *
	 * @param string $name data item name
	 */
	public function hasData( $name )
	{
		return $this->request->hasData( $name );
	}
	
	/**
	 * Returns unsecured (raw) data item
	 *
	 * @param  string $name data item name
	 * @return mixed
	 */
	public function getRawData( $name )
	{
		return $this->request->getRawData( $name );
	}
	
	/**
	 * Returns secured data item
	 *
	 * @param  string $name data item name
	 * @param  string $type data item type
	 * @return mixed
	 */
	public function getData( $name, $type )
	{
		return $this->request->getData( $name, $type );
	}
}