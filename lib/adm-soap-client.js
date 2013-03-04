var url = require('url');

var config = function(config) {
    this._config = config;

    if(!this._config.api_endpoint || 0 === !this._config.api_endpoint.length) {
		this._config.api_endpoint = "https://api.omniture.com/admin/1.3/";
    }
};

var call = function(method, args, callback) {
	var soap = require('soap');
	var WSSE = require('./wsse');
	var that = this;
	var endpoint = that._config.api_endpoint;
	var parts = url.parse(endpoint);
	
	// prepend wsdl to endpoint querystring
	if(parts['query'])
	{
		parts['query'] = 'wsdl&' + parts['query'];
		endpoint = parts['protocol'] + '//' + parts['hostname'] + parts['pathname'] + '?' + parts['query'];
	}
	else
	{
		endpoint += '?wsdl';
	}

	soap.createClient(endpoint, function(err, client) {
		client.setSecurity(new WSSE.Security(that._config.username, that._config.secret));
		client[method](args, callback);
	});
};

exports.config = config;
exports.call = call;
