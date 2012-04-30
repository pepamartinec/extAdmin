<?php
namespace ExtAdmin\Request;

class FakeRequest extends AbstractRequest
{
	/**
	 * @var string
	 */
	public $moduleName;

	/**
	 * @var string
	 */
	public $actionName;

	/**
	 * @var array
	 */
	public $parameters;

	/**
	 * @var array
	 */
	public $data;

	/**
	 * Constructor
	 *
	 * @param string $moduleName
	 * @param string $actionName
	 * @param array|null $parameters
	 * @param array|null $data
	 */
	public function __construct( $moduleName, $actionName, array $parameters = null, array $data = null )
	{
		$this->moduleName = $moduleName;
		$this->actionName = $actionName;
		$this->parameters = $parameters;
		$this->data       = $data;
	}
}