<?php
namespace ExtAdmin\Module\DataEditor;

use ExtAdmin\MalformedModuleException;
use ExtAdmin\ModuleAnalyzer;
use ExtAdmin\RequestInterface;
use ExtAdmin\Module\ModuleBase;

abstract class DataEditor extends ModuleBase
{
	const BUTTONS_KEY = 'buttons';

	const LOAD_ACTION_KEY = 'loadAction';
	const SAVE_ACTION_KEY = 'saveAction';

// 	/**
// 	 * Returns view configuration for current module
// 	 *
// 	 * @return array
// 	 */
// 	public function getViewConfiguration()
// 	{
// 		$conf    = parent::getViewConfiguration();
// // 		$actions = $this->getActions();

// // 		$this->initStandardActions( $conf );

// // 		if( array_key_exists( self::BUTTONS_KEY, $conf ) === false ) {
// // 			$conf[ self::BUTTONS_KEY ] = array();
// // 		}



// 		return $conf;
// 	}

	/**
	 * Initializes standard editor actions (save & cancel)
	 *
	 * @param array $conf
	 */
	private function initStandardActions( array &$conf )
	{
		// touch buttons config
		if( array_key_exists( self::BUTTONS_KEY, $conf ) === false ) {
			$conf[ self::BUTTONS_KEY ] = array();
		}

		$buttons        =& $conf[ self::BUTTONS_KEY ];
		$loadActionName =  $conf[ self::LOAD_ACTION_KEY ];
		$saveActionName =  $conf[ self::SAVE_ACTION_KEY ];

		// save
		if( ModuleAnalyzer::hasActionButton( $saveActionName, $buttons ) === false ) {
			$buttons[] = array(
				'type'   => 'button',
				'action' => $saveActionName
			);
		}

		// cancel
		if( array_key_exists( self::BTN_CANCEL, $buttons ) === false ) {
			$buttons[] = array(
					'type'   => 'button',
					'action' => $saveActionName
			);
		}
	}

	/**
	 * Validates module definition
	 *
	 * @param ModuleAnalyzer $analyzer
	 *
	 * @throws MalformedModuleException
	 */
	public function validateDefinition( ModuleAnalyzer $analyzer )
	{
		parent::validateDefinition( $analyzer );

		$actions = $analyzer->getActions();
		$conf    = $analyzer->getViewConfiguration();

		// check mandatory action pointers
		$this->checkMandatoryAction( $conf, $actions, self::LOAD_ACTION_KEY );
		$this->checkMandatoryAction( $conf, $actions, self::SAVE_ACTION_KEY );
	}

	/**
	 * Finds definition all actions with given type
	 *
	 * @param  array  $actions
	 * @param  string $type
	 * @return array
	 */
	private function findActionDefinitionByType( array $actions, $type )
	{
		$found = array();


		foreach( $actions as $name => $def ) {
			if( $def['type'] === $type ) {
				$found[ $name ] = $def;
			}
		}

		return $found;
	}

	/**
	 * Checks mandatory action configuration
	 *
	 * @param array $conf
	 * @param array $actions
	 * @param string $action
	 *
	 * @throws InvalidConfigurationException
	 */
	private function checkMandatoryAction( array $conf, array $actions, $action )
	{
		if( isset( $conf[ $action ] ) === false ) {
			throw new InvalidConfigurationException( "Missing '{$action}' configuration", $this );
		}

		$actionName = $conf[ $action ];

		if( isset( $actions[ $actionName ] ) === false ) {
			throw new InvalidConfigurationException( "Invalid '{$action}' configuration. '{$actionName}' is not a valid action", $this );
		}
	}
}