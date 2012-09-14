var crypto = require('crypto');
var _s = require('underscore.string');

var MAX_INTEGER = 2147483647;

var Security = function(username, secret) {
    this._username = username;
    this._secret = secret;

	this.randomInteger = function(n, m) {
		if (! m) {m = 1;} // default range starts at 1
		var max = n > m ? n : m; // doesn<q>t matter which value is min or max
		var min = n === max ? m : n; // min is value that is not max
		var d = max - min + 1; // distribution range
		return Math.floor(Math.random() * d + min);
	};

    this.gmdate = function(d) {
        function pad(n){return n < 10 ? '0'+n : n;}
        return d.getUTCFullYear() + '-' +
			pad(d.getUTCMonth()+1)+'-' +
			pad(d.getUTCDate())+'T' +
			pad(d.getUTCHours())+':' +
			pad(d.getUTCMinutes())+':' +
			pad(d.getUTCSeconds()) + '.000Z';
    };

    this.getParts = function() {
		var md5 = crypto.createHash('md5');
		//var integer = 88266680;
		var integer = this.randomInteger(0, MAX_INTEGER);

		md5.update(integer + '', 'ascii');
		var nonce = md5.digest();

		var now = new Date();
		var created = this.gmdate(now);

		var sha1 = crypto.createHash('sha1');
		sha1.update(nonce + created + this._secret);
		var digest = sha1.digest('base64');

		md5 = crypto.createHash('md5');
		md5.update(integer + '', 'ascii');
		var b64nonce = md5.digest('base64');

		return {
			digest: digest,
			b64nonce: b64nonce,
			created: created
		};
	};
};

Security.prototype.toHttpHeader = function() {
	var parts = this.getParts();

	return {'X-WSSE': _s.sprintf(
		'UsernameToken Username="%s", PasswordDigest="%s", Nonce="%s", Created="%s"',
		this._username,
        parts.digest,
        parts.b64nonce,
        parts.created
	)};
};

Security.prototype.toXML = function() {
	var parts = this.getParts();

	return _s.sprintf(
		'<wsse:Security wsse:mustUnderstand="1" xmlns:wsse="http://www.omniture.com">' +
			'<wsse:UsernameToken wsse:Id="User">' +
				'<wsse:Username>%s</wsse:Username>' +
				'<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">%s</wsse:Password>' +
				'<wsse:Nonce>%s</wsse:Nonce>' +
				'<wsse:Created>%s</wsse:Created>' +
			'</wsse:UsernameToken>' +
		'</wsse:Security>',
		this._username,
        parts.digest,
        parts.b64nonce,
        parts.created
	);
};

exports.Security = Security;