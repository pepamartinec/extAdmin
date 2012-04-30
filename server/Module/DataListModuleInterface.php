<?php
namespace ExtAdmin\Module;

use ExtAdmin\ModuleInterface;

interface DataListModuleInterface extends ModuleInterface
{
	/**
	 * Returns module UI definition
	 *
	 * @return array
	 */
	public function getModuleConfiguration();
}
