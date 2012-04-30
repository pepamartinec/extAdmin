<?php
namespace ExtAdmin\Module;

use ExtAdmin\MalformedModuleException;
use ExtAdmin\ModuleAnalyzer;
use ExtAdmin\AccessControllerException;
use ExtAdmin\ModuleInterface;
use ExtAdmin\AccessControllerInterface;

abstract class ModuleBase implements ModuleInterface
{
	/**
	 * Returns module actions definition
	 *
	 * @return array
	 */
	public function getActions()
	{
		$actions = $this->actions();
		return $actions;

		// TODO projit a vymyslet, kde vsude delat filtrovani akci

		// check access controller
		if( $this->accessController instanceof iAccessController === false ) {
			throw new ModuleException( 'Access controller not set' );
		}

		foreach( $actions as $name => $definition ) {
			if( isset( $definition['enabled'] ) === false ) {
				$enabled = true;

			} else {
				$enabled = $definition['enabled'];
			}

			if( is_callable( $enabled ) ) {
				$enabled = call_user_func( $enabled, null );
			}

			$actions[ $name ]['enabled'] = $enabled && true;
		}

		return $actions;
	}

	/**
	 * Module actions definition
	 *
	 * @return array
	 */
	abstract protected function actions();

	/**
	 * Returns module user-interface configuration
	 *
	 * @return array|null
	 */
	public function getViewConfiguration()
	{
		return $this->viewConfiguration();
	}

	/**
	 * Module view configuration
	 *
	 * @return array|null
	 */
	abstract protected function viewConfiguration();

	/**
	 * Validates module definition
	 *
	 * @param ModuleAnalyzer $analyzer
	 *
	 * @throws MalformedModuleException
	 */
	public function validateDefinition( ModuleAnalyzer $analyzer )
	{
		// TODO som standard tests??
	}
}