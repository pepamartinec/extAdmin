<?php
namespace ExtAdmin;

interface ModuleFactoryInterface
{
	/**
	 * Returns list of available module names
	 * 
	 * @return array
	 */
	public function getModulesList();
	
	/**
	 * Creates instance of requested module
	 *
	 * @param  string  $moduleName
	 * @return ExtAdmin\ModuleInterface
	 */
	public function factoryModule( $moduleName );
}