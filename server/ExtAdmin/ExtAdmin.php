<?php
namespace ExtAdmin;

use WebBuilder\Util\Iterators\CallbackFilterIterator;

use ExtAdmin\ModuleFactoryInterface;
use ExtAdmin\Module\SystemModuleFactory;
use ExtAdmin\Response\ActionResponse;

class ExtAdmin
{
	const ACTION_HANDLER_KEY = 'handler';
	const ACTION_ENABLED_KEY = 'enabled';

	/**
	 * List of available module factories
	 *
	 * @var array
	 */
	protected $factories;

	/**
	 * Constructor
	 *
	 */
	public function __construct()
	{
		$this->factories = array();

		$this->registerModuleFactory( '\ExtAdmin', new SystemModuleFactory( $this ) );
	}

	/**
	 * Registers module factory for specific namespace
	 *
	 * @param ModuleFactoryInterface $factory
	 */
	public function registerModuleFactory( $namespace, ModuleFactoryInterface $factory )
	{
		$this->factories[ $namespace ] = $factory;
	}

	/**
	 * Returns list of registered module factories
	 *
	 * @return array
	 */
	public function getModuleFactories()
	{
		return $this->factories;
	}

	/**
	 * Searches factory for given module
	 *
	 * @param  string $moduleName
	 * @return ModuleFactoryInterface|null
	 */
	protected function findModuleFactory( $moduleName )
	{
		foreach( $this->factories as $namespace => $factory ) {
			/* @var $factory ModuleFactoryInterface */

			if( substr_compare( $namespace , $moduleName, 0, strlen( $namespace ) ) === 0 ) {
				return $factory;
			}
		}

		return null;
	}

	/**
	 * Creates module instance
	 *
	 * @param  string $moduleName
	 * @return ModuleInterface|null
	 */
	public function factoryModule( $moduleName )
	{
		// find module factory
		$factory = $this->findModuleFactory( $moduleName );

		if( $factory === null ) {
			return null;
		}

		// cretae module instance
		return $factory->factoryModule( $moduleName );
	}

	/**
	 * Handlers ExtAdmin client request
	 *
	 * @param RequestInterface $request
	 */
	public function handleClientRequest( RequestInterface $request )
	{
		try {
			$moduleName = $request->getModuleName();

			$module = $this->factoryModule( $moduleName );

			if( $module === null ) {
				// TODO zrusit nahardkodovanou odpoved, sjednotit na iResponse
				header( 'HTTP/1.1 400 Bad Request' );
				echo json_encode( array(
					'status'  => false,
					'message' => "Invalid module '{$moduleName}'"
				) );
				return;
			}

			// run action
			$response = $this->runAction( $module, $request );

		} catch( \Exception $e ) {
			$response = new ActionResponse( false );
			$response->setStatus( ActionResponse::S_EXCEPTION )
			         ->setMessage( $e->getMessage().' at '.$e->getFile().':'.$e->getLine() );
		}

		// return response
		echo $response->send( $module );
	}

	/**
	 * Runs given action within request scope
	 *
	 * @param  ModuleInterface $module
	 * @param  RequestInterface   $request
	 * @return ResponseInterface
	 *
	 * @throws MalformedModuleException
	 */
	protected function runAction( ModuleInterface $module, RequestInterface $request )
	{
		$moduleName = $request->getModuleName();
		$actionName = $request->getActionName();

		// check whether action is defined
		$actions = $module->getActions();

		if( isset( $actions[ $actionName ] ) === false ) {
			$response = new ActionResponse( false );
			$response->setStatus( ActionResponse::S_INVALID_ACTION )
			         ->setMessage( "Invalid action '{$moduleName}.{$actionName}' called" );

			return $response;
		}

		$action = $actions[ $actionName ];

		// check whether handler method exists
		$actionMethod = $actionName .'Action';

		if( isset( $action[ self::ACTION_HANDLER_KEY ] ) === true ) {
			$actionMethod = $action[ self::ACTION_HANDLER_KEY ];
		}

		if( is_callable( array( $module, $actionName ) ) === false ) {
			throw new MalformedModuleException( "Missing implementation of an '{$moduleName}.{$actionName}' action. Check whether module class contains public method '{$actionMethod}'" );
		}

		// check action state
		$isEnabled = true;

		if( isset( $action[ self::ACTION_ENABLED_KEY ] ) ) {
			$enabled = $action[ self::ACTION_ENABLED_KEY ];

			// constant boolean
			if( is_bool( $enabled ) ) {
				$isEnabled = $enabled;

			// function callback
			} elseif( is_callable( $enabled ) ) {
				$isEnabled = (bool)call_user_func( $enabled );

			// invalid definition
			} else {
				$key = self::ACTION_ENABLED_KEY;
				throw new MalformedModuleException( "'{$moduleName}.{$actionName}' has invalid action state ('{$key}' property) definition" );
			}
		}

		if( $isEnabled !== true ) {
			$response = new ActionResponse( false );
			$response->setStatus( ActionResponse::S_UNAUTHORIZED )
			         ->setMessage( "User is not authorized to run '{$moduleName}.{$actionName}' action" );

			return $response;
		}

		// run action
		$response = call_user_func( array( $module, $actionName ), $request );

		if( $response instanceof ResponseInterface === false ) {
			$responseClass = is_object( $response ) ?
				get_class( $response ) :
				gettype( $response );

			throw new MalformedModuleException( "'{$moduleName}.{$actionName}' returns '{$responseClass}' instead of 'ResponseInterface'" );
		}

		return $response;
	}
}