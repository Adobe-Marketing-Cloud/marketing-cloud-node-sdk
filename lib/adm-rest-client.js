var Shred = require("shred");
var url = require("url");
var shred = new Shred();

var config = function(config) {
    this._config = config;

    if(!this._config.api_endpoint || 0 === !this._config.api_endpoint.length) {
		this._config.api_endpoint = "https://api.omniture.com/admin/1.3/";
    }
};

var call = function(method, args, callback) {
	var WSSE = require('./wsse');
    var that = this;

    var Security = new WSSE.Security(that._config.username, that._config.secret);
	
	var _url = this._config.api_endpoint + 'rest/?method=' + method;
	var opts = {
		headers: Security.toHttpHeader(),
		method: 'post', data: args
	};

	// set content type header
	opts.headers["Accept"] = "*/*";
	opts.headers["Content-Type"] = "application/x-www-form-urlencoded";

	var _proxy = null;
	if(process.env.API_PROXY) {
		var curl = url.parse(_url);
		opts.headers["Host"] = curl.host;
		_proxy = process.env.API_PROXY;
	}

	var req = shred.post({
		url: _url,
		headers: opts.headers,
		content: JSON.stringify(args),
		proxy: _proxy,
		on: {
			200: function(response) {
				callback(null, response);
			},
			error: function(response) {
				callback(new Error(response.content.data.errors), response);
			},
			response: function(response) {
				callback(new Error(response.content.data), response);
			}
		}
	});
};

exports.config = config;
exports.call = call;
