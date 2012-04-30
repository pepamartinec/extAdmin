<?php
namespace ExtAdmin;

interface AccessControllerInterface
{
	/**
	 * Checks whether current user is allowed to
	 * run given action
	 *
	 * @param  mixed $action
	 * @return bool
	 */
	public function isAllowed( $action );
	
	/**
	 * Checks whether current user is allowed to
	 * run all of given actions
	 *
	 * @param  mixed $action
	 * @return bool
	 */
	public function isAllowedAll( array $actions );
	
	/**
	 * Checks whether current user is allowed to
	 * run any of given actions
	 *
	 * @param  mixed $action
	 * @return bool
	 */
	public function isAllowedAny( array $actions );
}