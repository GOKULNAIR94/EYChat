module.exports = function( processConfig, token, callback) {
	var fs = require('fs'),
		path = require('path');

	var FileName, DeviceName;
	FileName = processConfig.File;
	DeviceName = processConfig.Device;
				
    var https = require("http");

    var options = {
        "method": "POST",
        "hostname": "172.16.5.182",
        "port": null,
        "path": "/v2/automations/deploy",
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
			var automationId = resObj.automationId;
            console.log( "Automation ID : " + automationId )
			callback({
                "status": 200,
                "output": automationId
            });
        });
    });
	
	var GetDeviceId = require("./getdevice");
	var GetFileId = require("./getfile");
	
	GetDeviceId( DeviceName, token, function(outputGetDevice){
		var DeviceId = outputGetDevice.output
		
		GetFileId( FileName, token, function(outputGetFile){
			var FileId = outputGetFile.output
			
			reqHttps.write("{\r\n  \"fileId\": \""+ FileId +"\",\r\n  \"deviceIds\": [\r\n    \""+ DeviceId +"\"\r\n  ]\r\n}");
			reqHttps.end();
		});
	});
    


}