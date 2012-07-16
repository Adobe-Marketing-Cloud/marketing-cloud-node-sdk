adobe-digital-marketing-node-sdk
===============

NodeJS module for connecting to the Adobe Digital Marketing APIs. Provides both the REST (default) and SOAP clients.

## Node.js installation ##

**npm package**

    npm install http://git.io/j15S_w

**Implementation**:

```javascript
var client = require('adobe-digital-marketing-node-sdk');

// configuration values
var config = {
	username: "myusername:My Company Name",
	secret: "mypassword"
};

// sets client configuration
client.config(config);

var args = {
	company: "My Company Name"
};

// perform a REST service call
client.rest('Company.GetEndpoint', args,
    function(err, response) {

        if(err) {
            console.log(err.stack);
            return;
        }

        console.log(response);
    }
);

// perform a SOAP service call
client.soap('Company.GetEndpoint', args,
    function(err, response) {

        if(err) {
            console.log(err.stack);
            return;
        }

        console.log(response);
    }
);
```
