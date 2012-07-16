var xmlData = null;

exports.getData = function() {
	return xmlData;
};

/**
 * Overrides the http request function so that the http
 * request data can be captured
 */
exports.request = function(request) {
	var _req = request.request;

	request.request = function(rurl, data, callback, exheaders, exoptions) {
		xmlData = data;
		return _req(rurl, data, callback, exheaders, exoptions);
	};
};