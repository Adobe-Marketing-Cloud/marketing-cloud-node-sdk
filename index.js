var http = require('soap/lib/http');
var adm_rest_client = require('./lib/adm-rest-client');
var adm_soap_client = require('./lib/adm-soap-client');
var nxmlpp = require('nxmlpp');
var util = require('util');
var url = require('url');
var req = require('request');
var S = require('string');
var clc = require('cli-color');

// override http request function
var libHttp = require('./lib/http');
libHttp.request(http);

var _config = {};

var getLogMessage = function(uri, message, statusCode, request, response, inputType) {

	//console.log(uri);

	var _req = "\n" + clc.blue(S('-').repeat(60).s) + "\n";
	_req += clc.blue("*") + clc.cyan(" SERVER REQUEST [" + clc.red(message) + "]") + "\n";
	_req += clc.blue("*") + clc.cyan(" URL: ") + uri + "\n";
	_req += clc.blue(S('-').repeat(60).s) + "\n";

	var _res = clc.blue(S('-').repeat(60).s) + "\n";
	_res += clc.blue("*") + clc.cyan(" SERVER RESPONSE [" + clc.red(message) + "]") + "\n";
	_res += clc.blue("*") + clc.cyan(" STATUS CODE: ") + statusCode + "\n";
	_res += clc.blue(S('-').repeat(60).s) + "\n";

	if(inputType == 'json') {
		_req += util.inspect(request, null, null, true) + "\n";
		if(response instanceof Buffer) {
			_res += response.toString() + "\n";
		} else {
			_res += util.inspect(response, null, null, true) + "\n";
		}
	} else {
		_req += nxmlpp.strPrint(request);

		try {
			_res += nxmlpp.strPrint(response);
		} catch (e) {
			_res += response + "\n";
		}
	}

	return _req + _res + clc.blue(S('-').repeat(60).s);
};

var config = function(config) {
	// hack to quickly clone the object
	var _c = JSON.parse(JSON.stringify(config));

	// append username and company for api auth
	if(!_c.username.match('/:/') && _c.company) {
		_c.username = _c.username + ':' + _c.company;
	}

	_config = _c;

	adm_rest_client.config(_c);
	adm_soap_client.config(_c);
};

var rest = function(method, args, callback, options) {
	options = (options) ? options : {};
	adm_rest_client.call(method, args, function(err, result) {
		if(options.rawRequest && options.rawRequest === true) {
			callback(err, result);
		} else {
			callback(err, result.content.data);
		}
		if(process.env.API_LOG_LEVEL && parseInt(process.env.API_LOG_LEVEL, 10) > 0 ) {
			var uri = _config.api_endpoint + 'rest.html?method=' + method;
			var statusCode = result.status || 200;
			console.log(getLogMessage(uri, method, statusCode.toString(), args, result.content.data, 'json'));
		}
	});
};

var soap = function(method, args, callback) {

	var _req = req;

	adm_soap_client.call(method, args, function(err, result, body) {
		callback(err, result);
		if(process.env.API_LOG_LEVEL && parseInt(process.env.API_LOG_LEVEL, 10) > 0 && body) {
			var statusCode = result.statusCode || '200';
			console.log(getLogMessage(_config.api_endpoint, method, statusCode, libHttp.getData(), body, 'xml'));
		}
	});
};

exports.config = config;
exports.rest = rest;
exports.soap = soap;