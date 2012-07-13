var adm_rest_client = require('./lib/adm-rest-client.js');
var adm_soap_client = require('./lib/adm-soap-client.js');

var rest = function(method, args, callback) {
	adm_rest_client.call(method, args, callback);
};

var soap = function(method, args, callback) {
	adm_soap_client.call(method, args, callback);
};

exports.rest = rest;
exports.soap = soap;