<?php
namespace ExtAdmin\Module;

use ExtAdmin\ExtAdmin;
use ExtAdmin\ModuleFactoryInterface;

class SystemModuleFactory implements ModuleFactoryInterface
{
	/**
	 * @var ExtAdmin
	 */
	protected $extAdmin;
	
	/**
	 * Factory constructor
	 * 
	 * @param ExtAdmin $extAdmin
	 */
	public function __construct( ExtAdmin $extAdmin )
	{
		$this->extAdmin = $extAdmin;
	}
	
	/**
	 * Returns list of available module names
	 *
	 * @return array
	 */
	public function getModulesList()
	{
		return array(
			'\\ExtAdmin\\Module\\SystemModule'
		);
	}
	
	/**
	 * Creates instance of requested module
	 *
	 * @param  string  $moduleName
	 * @return ExtAdmin\ModuleInterface
	 */
	public function factoryModule( $moduleName )
	{
		return new $moduleName( $this->extAdmin );
	}
}