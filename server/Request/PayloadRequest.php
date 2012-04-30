<?php
namespace ExtAdmin\Request;

class PayloadRequest extends AbstractRequest
{
	/**
	 * Constructor
	 *
	 * @param iModule $adminModule
	 */
	public function __construct()
	{
		$this->prepareParameters();
	}

	/**
	 * Prepares parameters & data
	 *
	 * Parameters are taken both from URL and data payload,
	 * data are taken from request data payload
	 *
	 * @return array list of reserved parameters names
	 */
	protected function prepareParameters()
	{
		// get URL parameters
		$this->parameters = $_GET ?: array();

		// pick module & action names
		$this->moduleName = $this->secureData( $this->parameters, self::KEY_MODULE_NAME, 'string' );
		unset( $this->parameters[ self::KEY_MODULE_NAME ] );

		$this->actionName = $this->secureData( $this->parameters, self::KEY_ACTION_NAME, 'string' );
		unset( $this->parameters[ self::KEY_ACTION_NAME ] );

		// get request data payload
		$requestData = json_decode( file_get_contents( 'php://input' ), true );

		// append parameters form data payload to URL parameters (overwriting existing ones)
		if( isset( $requestData['parameters'] ) ) {
			$this->parameters = $requestData['parameters'] + $this->parameters;
		}

		// pick request data
		if( isset( $requestData['data'] ) ) {
			$this->data = $requestData['data'];

		} else {
			$this->data = array();
		}
	}
}