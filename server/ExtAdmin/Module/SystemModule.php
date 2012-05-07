<?php
namespace ExtAdmin\Module;

use ExtAdmin\MalformedModuleException;
use ExtAdmin\ModuleAnalyzer;
use ExtAdmin\ModuleInterface;
use ExtAdmin\ExtAdmin;
use ExtAdmin\RequestInterface;
use ExtAdmin\Response\ActionResponse;

class SystemModule implements ModuleInterface
{
	/**
	 * @var ExtAdmin
	 */
	protected $extAdmin;

	/**
	 * Module constructor
	 *
	 * @param ExtAdmin $extAdmin
	 */
	public function __construct( ExtAdmin $extAdmin )
	{
		$this->extAdmin = $extAdmin;
	}

	/**
	 * Returns module actions definition
	 *
	 * @return array
	 */
	public function getActions()
	{
		return array(
			'getMenuItems'        => true,
			'getModuleDefinition' => true,
		);
	}

	/**
	 * Returns module user-interface configuration
	 *
	 * @return null
	 */
	public function getViewConfiguration()
	{
		return null;
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

	}

	/**
	 * Returns all available modules definition
	 *
	 * @param RequestInterface $request
	 */
	public function getMenuItems( RequestInterface $request )
	{
		$response = new ActionResponse( true );
		$response->setData( array(
//			array(
//				'name'        => 'Blocks Manager',
//				'entryModule' => '\\WebBuilder\\Administration\\BlockManager\\BlocksList',
//			),

			array(
				'name'        => 'Editor Webu',
				'iconCls'     => 'i-web-editor',
				'entryModule' => '\\DemoCMS\\Administration\\WebEditor\\PageList',
			),

			array(
				'name'        => 'Správa šablon',
				'iconCls'     => 'i-template-manager',
				'entryModule' => '\\WebBuilder\\Administration\\TemplateManager\\TemplateList',
			),

			array(
				'name'        => 'Správa textů',
				'iconCls'     => 'i-text-block-manager',
				'entryModule' => '\\DemoCMS\\Administration\\TextBlockManager\\TextBlockList',
			),
		) );

		return $response;
	}

	/**
	 * Returns module definition
	 *
	 * @param RequestInterface $request
	 */
	public function getModuleDefinition( RequestInterface $request )
	{
		$moduleName = $request->getParameter( 'module', 'string' );
		$module     = $this->extAdmin->factoryModule( $moduleName );

		if( $module === null ) {
			$response = new ActionResponse( false );
			$response->setMessage( "Invalid module '{$moduleName}' definition requested" );

			return $response;
		}

		$response = new ActionResponse( true );
		$response->setData( array(
			'actions' => $module->getActions(),
			'view'    => $module->getViewConfiguration()
		) );

		return $response;
	}
}