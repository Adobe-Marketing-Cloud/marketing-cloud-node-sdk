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

var getLogMessage = function(message, request, response, inputType) {

	var _req = "\n" + clc.blue(S('-').repeat(60).s) + "\n";
	_req += clc.blue("*") + clc.cyan(" SERVER REQUEST [" + clc.red(message) + "]") + "\n";

	var _res = clc.blue(S('-').repeat(60).s) + "\n";
	_res += clc.blue("*") + clc.cyan(" SERVER RESPONSE [" + clc.red(message) + "]") + "\n";

	if(inputType == 'json') {
		_req += util.inspect(request, null, null, true) + "\n";
		_res += util.inspect(response, null, null, true) + "\n";
	} else {
		_req += nxmlpp.strPrint(request);
		_res += nxmlpp.strPrint(response)
	}

	return _req + _res + clc.blue(S('-').repeat(60).s);
};

var config = function(config) {
	adm_rest_client.config(config);
	adm_soap_client.config(config);
};

var rest = function(method, args, callback) {
	adm_rest_client.call(method, args, function(err, result) {

		if(process.env.API_LOG_LEVEL && parseInt(process.env.API_LOG_LEVEL) > 0 ) {
			console.log(getLogMessage(method, args, result.content.data, 'json'));
		}

		callback(err, result.content.data);
	});
};

var soap = function(method, args, callback) {

	var _req = req;

	adm_soap_client.call(method, args, function(err, result, body, xml) {

		if(process.env.API_LOG_LEVEL && parseInt(process.env.API_LOG_LEVEL) > 0 && body) {
			console.log(getLogMessage(method, libHttp.getData(), body, 'xml'));
		}

		callback(err, result);
	});
};

exports.config = config;
exports.rest = rest;
exports.soap = soap;