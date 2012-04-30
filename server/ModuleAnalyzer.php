<?php
namespace ExtAdmin;

use ExtAdmin\Module\InvalidConfigurationException;

class ModuleAnalyzer
{
	/**
	 * @var ModuleInterface
	 */
	protected $module;

	/**
	 * Module actions definition
	 *
	 * @var array
	 */
	protected $actions;

	/**
	 * Module view configuration
	 *
	 * @var array
	 */
	protected $view;

	/**
	 * Constructor
	 *
	 * @param ModuleInterface $module
	 */
	public function __construct( ModuleInterface $module )
	{
		$this->module = $module;

		$this->actions = $module->getActions();
		$this->view    = $module->getViewConfiguration();
	}

	/**
	 * Returns current module actions
	 *
	 * @return array
	 */
	public function getActions()
	{
		return $this->actions;
	}

	/**
	 * Returns current module view configuration
	 *
	 * @return array
	 */
	public function getViewConfiguration()
	{
		return $this->view;
	}

	public function registerValidator( $validator )
	{

	}

	/**
	 * Checks whether action is present in buttons configuration
	 *
	 * @param array $buttons
	 *
	 * @throws InvalidConfigurationException
	 */
	public function validateActionButtons( array $actions, array $buttons )
	{
		$this->validateActionButtons_subvalidate( $buttons, array_keys( $this->actions ) );
	}

	/**
	 * Checks whether action is present in buttons configuration
	 *
	 * @param array $buttons
	 * @param array $actions
	 *
	 * @throws InvalidConfigurationException
	 */
	private function validateActionButtons_subvalidate( array $buttons, array $actions )
	{
		foreach( $buttons as $button ) {
			if( is_array( $button ) ) {
				switch( $button['type'] ) {

					// normal button
					case 'button':
						if( isset( $button['action'] ) === false ) {
							throw new InvalidConfigurationException( "Invalid button configuration. 'action' property is missing", $this->module );
						}

						$this->validateActionButtons_find( $button['action'], $actions );
						break;

					// split button
					case 'splitButton':
						if( isset( $button['items'] ) === false ) {
							throw new InvalidConfigurationException( "Invalid split button configuration. 'items' property is missing", $this->module );
						}

						if( isset( $button['action'] ) ) {
							$this->validateActionButtons_find( $button['action'], $actions );
						}

						$this->validateActionButtons_subvalidate( $button['items'], $actions );
						break;

					// buttons group
					case 'group':
						if( isset( $button['items'] ) === false ) {
							throw new InvalidConfigurationException( "Invalid buttons group configuration. 'items' property is missing", $this->module );
						}

						$this->validateActionButtons_subvalidate( $button['items'], $actions );
						break;

					default:
						throw new InvalidConfigurationException( "Invalid type '{$button['type']}' in buttons configuration", $this->module );
				}

			// simple button
			} else {
				$this->validateActionButtons_find( $button, $actions );
			}
		}
	}

	/**
	 * Checks whether action is present in buttons configuration
	 *
	 * @param strign $action
	 * @param array  $actions
	 *
	 * @throws InvalidConfigurationException
	 */
	private function validateActionButtons_find( $action, array $actions )
	{
		if( in_array( $actions, $action ) === false ) {
			throw new InvalidConfigurationException( "Invalid button configuration. Action '{$action}' is not an valid action", $this->module );
		}
	}

	/**
	 * Checks whether action is present in buttons configuration
	 *
	 * @param  strign $action
	 * @param  array  $buttons
	 * @return bool
	 */
	public static function hasActionButton( $action, array $buttons )
	{
		foreach( $buttons as $button ) {
			if( is_array( $button ) ) {
				switch( $button['type'] ) {

					// button
					case 'button':
						if( $button['action'] === $action ) {
							return true;
						}

						break;

						// split button
					case 'splitButton':
						if( isset( $button['action'] ) && $button['action'] === $action ) {
							return true;
						}

						if( $this->findActionButton( $action, $button['items'] ) ) {
							return true;
						}
						break;

						// buttons group
					case 'group':
						if( $this->findActionButton( $action, $button['items'] ) ) {
							return true;
						}

						break;
				}

				// simple button
			} else {
				if( $button === $action ) {
					return true;
				}
			}
		}

		return false;
	}
}
