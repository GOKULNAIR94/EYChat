module.exports = function( callback) {
	console.log("In AA Login");
    var https = require("http");

    var options = {
        "method": "POST",
        "hostname": "172.16.5.182",
        "port": null,
        "path": "/v1/authentication",
        "headers": {
            "cache-control": "no-cache"
        }
    };

    var reqHttps = https.request(options, function(resHttps) {
        var chunks = [], resObj;

        resHttps.on("data", function(chunk) {
            chunks.push(chunk);
        });
		
		resHttps.on("error", function(error) {
            
			callback({
                "status": 400,
                "output": error
            });
        });

        resHttps.on("end", function() {
            var body = Buffer.concat(chunks);
            
            resObj = JSON.parse(body.toString())
            
			callback({
                "status": 200,
                "output": resObj.token
            });
        });
    });

    reqHttps.write("{\r\n\"username\": \"pladmin\",\r\n\"password\": \"tcl1234$#@!\"\r\n}\r\n\r\n\r\n");
    reqHttps.end();
}