module.exports = function( DeviceName, token, callback) {
	var fs = require('fs'),
		path = require('path');

    var https = require("http");

    var options = {
        "method": "POST",
        "hostname": "172.16.5.182",
        "port": null,
        "path": "/v2/devices/list",
        "headers": {
            "x-authorization": token,
            "cache-control": "no-cache"
        }
    };

    var reqHttps = https.request(options, function(resHttps) {
        var chunks = [], resObj;

        resHttps.on("data", function(chunk) {
            chunks.push(chunk);
        });
		
		resHttps.on("error", function(chunk) {
            chunks.push(chunk);
			var body = Buffer.concat(chunks);
            console.log(body.toString());
			callback({
                "status": 400,
                "output": body
            });
        });

        resHttps.on("end", function() {
            var body = Buffer.concat(chunks);
            
			resObj = JSON.parse(body)
			var deviceId = resObj.list[0].id;
            console.log( "Device ID : " + deviceId )
			callback({
                "status": 200,
                "output": deviceId
            });
        });
    });
	reqHttps.write("{\r\n  \"fields\": [\r\n    ],\r\n\"filter\": {\r\n   \"operator\": \"substring\",\r\n   \"value\": \""+ DeviceName +"\", \r\n   \"field\": \"hostName\"\r\n}\r\n}");
    reqHttps.end();


}