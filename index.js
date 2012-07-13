var adm_rest_client = require('./lib/adm-rest-client.js');
var adm_soap_client = require('./lib/adm-soap-client.js');

var config = function(config) {
	adm_rest_client.config(config);
	adm_soap_client.config(config);
};

var rest = function(method, args, callback) {
	adm_rest_client.call(method, args, callback);
};

var soap = function(method, args, callback) {
	adm_soap_client.call(method, args, callback);
};

exports.config = config;
exports.rest = rest;
exports.soap = soap;