<?php
namespace ExtAdmin\Module\DataBrowser;

use ExtAdmin\RequestInterface;
use ExtAdmin\Module\ModuleBase;

abstract class GridList extends ModuleBase
{
	const COMPONENT_CLASS = 'extAdmin.component.dataBrowser.browser.Grid';

	/**
	 * Returns module UI definition
	 *
	 * @return array
	 */
	public function getViewConfiguration()
	{
		$conf = parent::getViewConfiguration();

		// setup default component class
		if( isset( $conf['type'] ) === false ) {
			$conf['type'] = self::COMPONENT_CLASS;
		}

		if( isset( $conf['loadAction'] ) === false ) {
			$conf['loadAction'] = 'loadListData';
		}

		// filter-out invalid bar actions
// FIXME is this OK?
// 		if( isset( $conf['barActions'] ) ) {
// 			$moduleActions = $this->getModuleActions();
//
// 			$conf['barActions'] = array_intersect( $conf['barActions'], array_keys( $moduleActions ) );
// 		}

		return $conf;
	}

	/**
	 * Loads data for dataList
	 *
	 * @param  RequestInterface $request
	 * @return ExtAdmin\Response\cDataListResponse
	 */
	public abstract function loadListData( RequestInterface $request );
}