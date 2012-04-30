<?php
namespace ExtAdmin\Module;

use ExtAdmin\ModuleInterface;

interface FormModuleInterface extends ModuleInterface
{
	/**
	 * Returns defintion of form buttons
	 *
	 * @return array
	 */
	public function getButtonsDefinition();
}
