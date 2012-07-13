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

	soap.createClient(that._config.api_endpoint + "?wsdl", function(err, client) {
		client.setSecurity(new WSSE.Security(that._config.username + ':' + that._config.company, that._config.password));
		client[method](args, callback);
	});
};

exports.config = config;
exports.call = call;