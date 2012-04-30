<?php
namespace ExtAdmin\Response;

use ExtAdmin\ModuleInterface;

class DataBrowserResponse extends DataStoreResponse
{
	/**
	 * Determines actions property name based on module fields definition
	 *
	 * @param  array $fields Module fields definition
	 * @return string
	 */
	protected function determineActionsProperty( array $fields )
	{
		foreach( $fields as $name => $field ) {
			if( isset( $field['type'] ) === false ) {
				continue;
			}

			$type = $field['type'];

			if( $type !== 'action' && $type !== 'actioncolumn' ) {
				continue;
			}

			return $name;
		}

		return self::ACTIONS_PROPERTY;
	}

	/**
	 * Gets and prepares module action for easy data setup
	 *
	 * @param  ModuleInterface $module
	 * @return array
	 */
	private function prepareActions( ModuleInterface $module )
	{
		$actionsDef = $module->getActions();
		$actions    = array(
			'fixed'    => array(),
			'variable' => array()
		);

		foreach( $actionsDef as $name => $actionDef ) {
			if( isset( $actionDef['enabled'] ) === false ) {
				$actions['fixed'][ $name ] = true;
				continue;
			}

			$enabled = $actionDef['enabled'];

			if( is_callable( $enabled ) === true || $enabled instanceof \Closure ) {
				$actions['variable'][ $name ] = $enabled;

			} elseif( $enabled ) {
				$actions['fixed'][ $name ] = true;
			}
		}

		return $actions;
	}

	/**
	 * Builds response content
	 *
	 * @param ModuleInterface $module
	 * @return string
	 */
	protected function buildContent( ModuleInterface $module )
	{
		$data    = array();
		$actions = $this->prepareActions( $module );

		$fActions = $actions['fixed'];
		$vActions = $actions['variable'];

		$view = $module->getViewConfiguration();
		$actionsProperty = $this->determineActionsProperty( $view['fields'] );

		foreach( $this->records as $k => $record ) {
			// extract data
			if( $this->extractor !== null ) {
				$recordData = call_user_func( $this->extractor, $record );
			} else {
				$recordData = $record;
			}

			// TODO check $recordData is array

			// setup actions
			$recordActions = array_keys( $fActions );

			foreach( $vActions as $actionName => $vAction ) {
				if( call_user_func( $vAction, $record ) === true ) {
					$recordActions[] = $actionName;
				}
			}

			$recordData[ $actionsProperty ] = $recordActions;


			$data[ $k ] = $recordData;
		}

		$this->set( self::KEY_DATA, $data );

		return ActionResponse::buildContent( $module );
	}
}