<?php
namespace ExtAdmin\Request;

use ExtAdmin\RequestInterface;

class DataRequestDecorator extends RequestDecorator
{
	const KEY_FILTERS     = 'filter';
	const KEY_SORT        = 'sort';
	const KEY_LIMIT_FROM  = 'from';
	const KEY_LIMIT_COUNT = 'count';

	/**
	 * @var array
	 */
	protected $filters;

	/**
	 * @var array
	 */
	protected $sort;

	/**
	 * @var array
	 */
	protected $limit;

	/**
	 * Constructor
	 *
	 * @param RequestInterface $request
	 */
	public function __construct( RequestInterface $request )
	{
		parent::__construct( $request );

		// setup filters
		$this->filters = array();
		$rawFilters    = $this->getRawParameter( self::KEY_FILTERS );

		if( is_array( $rawFilters ) ) {
			foreach( $rawFilters as $name => $value ) {
				$this->filters[ $name ] = $value;
			}
		}

		// setup sort
		$this->sort = array();
		$rawSort    = $this->getRawParameter( self::KEY_SORT );

		if( is_array( $rawSort ) ) {
			foreach( $rawSort as $property => $direction ) {
				$this->sort[ $property ] = $direction;
			}
		}

		// setup limit
		$this->limit = array(
			$request->getParameter( self::KEY_LIMIT_FROM,  'int' ) ?: null,
			$request->getParameter( self::KEY_LIMIT_COUNT, 'int' ) ?: null,
		);
	}

	/**
	 * Returns $filters value
	 *
	 * @return array array( $filter => $value, ... )
	 */
	public function getFilters()
	{
		return $this->filters;
	}

	/**
	 * Checks whether the filter has any value set
	 *
	 * @param string $name
	 * @return boolean
	 */
	public function hasFilter( $name, $type = 'string' )
	{
		return isset( $this->filters[ $name ] ) && $this->filters[ $name ] !== '';
	}

	/**
	 * Returns filter value
	 *
	 * @param string $name
	 * @param string $type
	 * @return mixed
	 */
	public function getFilter( $name, $type = 'string' )
	{
		return $this->request->secureData( $this->filters, $name, $type );
	}

	/**
	 * Allows to manually overriding or appending custom filters
	 *
	 * When filter value is NULL, filter is removed
	 *
	 * @param array $filters array( $filter => $value, ... )
	 */
	public function modifyFilters( array $filters )
	{
		// merge filters
		$this->filters = $filters + $this->filters;

		// filter-out empty filters
		foreach( $this->filters as $name => $value ) {
			if( $value === null ) {
				unset( $this->filters[ $value ] );
			}
		}
	}

	/**
	 * Returns $sort value
	 *
	 * @return array array( $property => $direction, ... )
	 */
	public function getOrdering()
	{
		return $this->sort;
	}

	/**
	 * Returns $limit value
	 *
	 * @return array array( $from, $count )
	 */
	public function getLimit()
	{
		return $this->limit;
	}
}