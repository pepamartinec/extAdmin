<?php
namespace ExtAdmin\Module\DataBrowser;

use ExtAdmin\RequestInterface;
use ExtAdmin\Module\ModuleBase;

abstract class TreeList extends ModuleBase
{
	const COMPONENT_CLASS = 'extAdmin.component.dataBrowser.browser.Tree';

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

		return $conf;
	}

	/**
	 * Loads data for the dataList
	 *
	 * @param  RequestInterface $request
	 * @return ExtAdmin\Response\DataListResponse
	 */
	public abstract function loadListData( RequestInterface $request );
}