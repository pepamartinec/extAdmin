<?php
namespace ExtAdmin\Response;

use ExtAdmin\ModuleInterface;

class DataStoreResponse extends ActionResponse
{
	const KEY_MODEL = 'model';
	const KEY_TOTAL = 'total';

	const ACTIONS_PROPERTY = 'actions';

	/**
	 * @var callback
	 */
	protected $extractor;

	/**
	 * @var array
	 */
	protected $records;

	/**
	 * Creates new response instance
	 *
	 * @param bool          $success whether was request successful
	 * @param array         $data    response data
	 * @param int|null       $total   total data items count (including filtered-out pages etc.)
	 * @param callback|null $dataExtractor callback used to extract raw data to send from supplied records
	 */
	function __construct( $success, array $records, $total = null, $dataExtractor = null )
	{
		parent::__construct( $success );

		// set total
		if( $total === null ) {
			$total = sizeof( $records );
		}

		$this->set( self::KEY_TOTAL, $total );

		// set records
		$this->records = $records;

		// TODO check is_callable || null
		$this->extractor = $dataExtractor;
	}

	/**
	 * Builds response content
	 *
	 * @param ModuleInterface $module
	 * @return string
	 */
	protected function buildContent( ModuleInterface $module )
	{
		$data = array();

		foreach( $this->records as $k => $record ) {
			// extract data
			if( $this->extractor !== null ) {
				$recordData = call_user_func( $this->extractor, $record );
			} else {
				$recordData = $record;
			}

			// TODO check $recordData is array

			$data[ $k ] = $recordData;
		}

		$this->set( self::KEY_DATA, $data );

		return parent::buildContent( $module );
	}

	/**
	 * Sets total number of data items
	 *
	 * @param  int $total
	 * @return ExtAdmin\Response\cDataListResponse
	 */
	public function setTotal( $total )
	{
		$this->set( self::KEY_TOTAL, $total );
		return $this;
	}
}