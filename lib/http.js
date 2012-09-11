var xmlData = null;
var url = require('url');

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
		
		if(process.env.API_PROXY) {
			exheaders = (exheaders) ?  exheaders : [];
			exoptions = (exoptions) ?  exoptions : [];
			var curl = url.parse(rurl);
			exheaders.Host = curl.host;
			exoptions.proxy = process.env.API_PROXY;
		}

		xmlData = data;
		return _req(rurl, data, callback, exheaders, exoptions);
	};
};
