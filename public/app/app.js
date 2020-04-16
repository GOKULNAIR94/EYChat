var app = angular.module('MyApp',["ngRoute"]);
app.run(function(){
    console.log("My App is Running!");
});

app.config(function($routeProvider,$locationProvider) {    $routeProvider
.when("/", {
        templateUrl : "/home.html"
    })
$locationProvider.html5Mode(true);
});


app.controller('mainCont', function($scope, $http, $location ) {
    console.log("mainCont");
    
	$scope.inputquery = '';
	$scope.typingFlag = 0;
	
	var messages = [], 
		lastUserMessage = "", 
		botMessage = "", 
		botName = 'JARVIS', 
		talking = true; 
	
	function newEntry() {
		if (document.getElementById("chatbox").value != "") {
		lastUserMessage = document.getElementById("chatbox").value;
		
		document.getElementById("chatbox").value = "";
		
		messages.push("<b> You :</b> " +lastUserMessage);
		
		for (var i = 1; i < 8; i++) {
			if (messages[messages.length - i])
				document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
		}
					
		chatbotResponse();
		
		
	  }
	}

	document.onkeypress = keyPress;
	function keyPress(e) {
		
		
	  var x = e || window.event;
	  var key = (x.keyCode || x.which);
	  if (key == 13 || key == 3) {
		$scope.typingFlag = 1;
		newEntry();
	  }
	  if (key == 38) {
		console.log('hi')
	  }
	}

	function Speech(say) {
	  if ('speechSynthesis' in window && talking) {
		var utterance = new SpeechSynthesisUtterance(say);
		//msg.voice = voices[10]; // Note: some voices don't support altering params
		//msg.voiceURI = 'native';
		//utterance.volume = 1; // 0 to 1
		//utterance.rate = 0.1; // 0.1 to 10
		//utterance.pitch = 1; //0 to 2
		//utterance.text = 'Hello World';
		//utterance.lang = 'en-US';
		speechSynthesis.speak(utterance);
	  }
	}

  
	function chatbotResponse() {
        console.log("test"+lastUserMessage);

		if( lastUserMessage.trim() != '' && lastUserMessage != null ) {

			var req = {
				method: 'POST',
				url: 'http://localhost:9000/input',
				data: {
					'inputquery' : lastUserMessage
				}
			}
			$http(req).then(function (result) {
				console.log( "Result : " + JSON.stringify(result));
				if(result.status == 200){
					botMessage = result.data.output
					$scope.typingFlag = 0;
					messages.push("<b>" + botName + ":</b> " + botMessage);
		
					Speech(botMessage);
					
					for (var i = 1; i < 8; i++) {
					  if (messages[messages.length - i])
						document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
					}
				}  
				else{
					alert("Error");
					$scope.errormessage = "Unexpected Error Occured! Try again later!";
				}
				
			});
			
		}
		else{
			alert("Please enter a valid message!");
		}
        
    };
	
    $scope.contents = [
        {
            "category" : "World",
            "heading" : "Featured",
            "date" : "12 Nov",
            "shortdesc" : "This is a wider card with supporting text below as a natural lead-in to additional content.",
            "descrition" : "World"
        }]
});