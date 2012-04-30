<?php
namespace ExtAdmin\Request;

use ExtAdmin\RequestInterface;

abstract class AbstractRequest implements RequestInterface
{
	const KEY_MODULE_NAME = 'module';
	const KEY_ACTION_NAME = 'action';

	/**
	 * @var string
	 */
	protected $moduleName;

	/**
	 * @var string
	 */
	protected $actionName;

	/**
	 * @var array
	 */
	protected $parameters;

	/**
	 * @var array
	 */
	protected $data;

	/**
	 * Returns requested module name
	 *
	 * @return string
	 */
	public function getModuleName()
	{
		return $this->moduleName;
	}

	/**
	 * Returns requested action name
	 *
	 * @return string
	 */
	public function getActionName()
	{
		return $this->actionName;
	}

	/**
	 * Tests whether given parameter exists
	 *
	 * @param string $name parameter name
	 */
	public function hasParameter( $name )
	{
		return isset( $this->parameters[ $name ] );
	}

	/**
	 * Returns unsecured (raw) parameter
	 *
	 * @param  string $name parameter name
	 * @return mixed
	 */
	public function getRawParameter( $name )
	{
		if( isset( $this->parameters[ $name ] ) ) {
			return $this->parameters[ $name ];

		} else {
			return null;
		}
	}

	/**
	 * Returns secured parameter value
	 *
	 * @param  string $name parameter name
	 * @param  string $type parameter type
	 * @return mixed
	 */
	public function getParameter( $name, $type )
	{
		return self::secureData( $this->parameters, $name, $type );
	}

	/**
	 * Tests whether given data item exists
	 *
	 * @param string $name data item name
	 */
	public function hasData( $name )
	{
		return isset( $this->data[ $name ] );
	}

	/**
	 * Returns unsecured (raw) data item
	 *
	 * @param  string $name data item name
	 * @return mixed
	 */
	public function getRawData( $name )
	{
		if( isset( $this->data[ $name ] ) ) {
			return $this->data[ $name ];

		} else {
			return null;
		}
	}

	/**
	 * Returns secured data item value
	 *
	 * @param  string $name data item name
	 * @param  string $type data item type
	 * @return mixed
	 */
	public function getData( $name, $type )
	{
		return self::secureData( $this->data, $name, $type );
	}

	/**
	 * Returns secured data
	 * Used for securing user input ($_GET, $_POST, ...)
	 *
	 * @param  mixed  $data data to secure
	 * @param  string $type data type
	 * @return mixed
	 */
	public static function secureData( $dataSet, $dataKey, $type = 'string' )
	{
		if( isset( $dataSet[ $dataKey ] ) === false ) {
			return null;
		}

		return self::secureValue( $dataSet[ $dataKey ], $type );
	}

	/**
	 * Returns secured value
	 *
	 * @param  mixed  $data data to secure
	 * @param  string $type data type
	 * @return mixed
	 */
	public static function secureValue( $value, $type = 'string' )
	{
		switch( strtolower( $type ) ) {
			case 'bool':
			case 'boolean':
				return $value === 't'    // legacy database CHAR(1)
				    || $value === 'true' // textual
				    || $value == 1       // numeric
				    || $value === true   // boolean
				    || $value === 'on';  // form

			case 'int':
			case 'integer':
				return (int)$value;

			case 'float':
			case 'double':
				return (float)$value;

			case 'date':
				return date('Y-m-d', strtotime( $value ) );

			case 'time':
				return date('h:i:s', strtotime( $value ) );

			case 'datetime':
				return date('Y-m-d h:i:s', strtotime( $value ) );

			case 'string':
			default:
				return (string)$value;
		}
	}
}