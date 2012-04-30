<?php
namespace ExtAdmin;

interface ModuleInterface
{
	/**
	 * Returns module actions definition
	 *
	 * @return array
	 */
	public function getActions();

	/**
	 * Returns module user-interface configuration
	 *
	 * @return array|null
	 */
	public function getViewConfiguration();

	/**
	 * Validates module definition
	 *
	 * @param ModuleAnalyzer $analyzer
	 *
	 * @throws MalformedModuleException
	 */
	public function validateDefinition( ModuleAnalyzer $analyzer );
}
