<?php
namespace ExtAdmin;

interface RequestInterface
{	
	/**
	 * Returns requested module name
	 *
	 * @return string
	 */
	public function getModuleName();
	
	/**
	 * Returns requested action name
	 *
	 * @return string
	 */
	public function getActionName();
	
	
	
	/**
	 * Tests whether given parameter exists
	 *
	 * @param string $name parameter name
	 */
	public function hasParameter( $name );
	
	/**
	 * Returns unsecured (raw) parameter
	 *
	 * @param  string $name parameter name
	 * @return mixed
	 */
	public function getRawParameter( $name );
	
	/**
	 * Returns secured parameter
	 *
	 * @param  string $name parameter name
	 * @param  string $type parameter type
	 * @return mixed
	 */
	public function getParameter( $name, $type );
	
	
	
	/**
	 * Tests whether given data item exists
	 *
	 * @param string $name data item name
	 */
	public function hasData( $name );
	
	/**
	 * Returns unsecured (raw) data item
	 *
	 * @param  string $name data item name
	 * @return mixed
	 */
	public function getRawData( $name );
	
	/**
	 * Returns secured data item
	 *
	 * @param  string $name data item name
	 * @param  string $type data item type
	 * @return mixed
	 */
	public function getData( $name, $type );
}