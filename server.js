
const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var https = require('https');
var fs = require('fs'),
    path = require('path');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

restService.get('/', onRequest);
restService.use(express.static(path.join(__dirname, '/public')));

function onRequest(request, response){
  response.sendFile(path.join(__dirname, '/public/index.html'));
}

restService.listen((process.env.PORT || 9000), function() {
  console.log("Server up and listening");
});

var DeployBot = require("./controllers/deploybot");
var AALogin = require("./controllers/aalogin");


restService.post('/input', function(req, res) {
	console.log("Server input : "+ JSON.stringify(req.body))
	var inputquery = req.body.inputquery
	console.log(inputquery)
	
	
    var apiai = require('apiai');

    var app = apiai("8d83e8d3c4404af88b7436823ce27348");

    var request = app.textRequest( inputquery, {
        sessionId: '1486656220806'
    });

    request.on('response', function(response) {
		console.log("Object - " + JSON.stringify(response.result) );
		var intentName = response.result.metadata.intentName
		console.log("Intent - " + intentName );
		
		if( intentName.indexOf( "Run_Bot" ) == 0 ) {
			var processName = '', PIN = '';
			processName = response.result.parameters['Process'];
			PIN = response.result.parameters['PIN'];
			
			console.log("processName : " + processName);
			console.log("PIN : " + PIN);
			
			if( processName != "" && PIN != "" ){
				var configPIN;
	
				var listConfig = fs.readFileSync("./config.json", 'utf8');	
				listConfig = JSON.parse(listConfig);
					
				for (var i = 0; i < listConfig.length; i++) {
					if (listConfig[i].Process.includes(processName)) {
						processConfig = listConfig[i];
						break;
					}
				}
				configPIN = processConfig.PIN;
				if( PIN != configPIN ){
					speech = "Invalid PIN. Please confirm the PIN and please try saying: Run XYZ process with PIN XXXX"
					res.json({
						"status": 200,
						"output": speech
					});
				}
				else{
					AALogin( function(output){
						console.log("Output from AALogin bot : " + output.output);
						
						var token = output.output;
							
						DeployBot( processConfig, PIN, token, function(output){
							
							console.log("Output from Deploy bot : " + output.output);
							var statusCode = output.status;
							var speech = ""
							
							if( statusCode == 200 ){
								speech = response.result.fulfillment.speech;						
								res.json({
									"status": 200,
									"output": speech
								});
							}
							
							if( statusCode == 300 ){
								speech = output.output;						
								
							}
							
							if( statusCode > 300 ){
								speech = "Unable to process your request. Please try again later.";						
								res.json({
									"status": 200,
									"output": speech
								});
							}
							
						});
					});
				}
				
			}
			else{
				var speech = response.result.fulfillment.speech;
				res.json({
					"status": 200,
					"output": speech
				});				
			}
			
		}
		else{
			var speech = response.result.fulfillment.speech;
			res.json({
				"status": 200,
				"output": speech
			});
		}
			
		
    });

    request.on('error', function(error) {
        console.log(error);
		res.json({
			"status": 400,
			"output": error
		});
    });

    request.end();

});