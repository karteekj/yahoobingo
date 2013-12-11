var socket = require("socket.io-client");
var client = socket.connect("ws://yahoobingo.herokuapp.com");

var game = "BINGO";
var verticalCount = {};
var horizontalCount = {};
var presentNums = {};
var card;  

client.emit('register', { 
			name : 'karteek', 
			email: 'karteekjasti@yahoo.com', 
			url : 'https://github.com/karteekj/yahoobingo' 
	});

client.on('connect' , function() { 
		console.log("Connected to server"); 
	});

client.on('card' , function(payload) {
	card = payload.slots;
	console.log(card);
	});  

client.on('number', function(value) {
		console.log(" Received number " + value);
		var ch = value.substr(0,1);
		var number = value.substr(1, value.length - 1);
		for(var key in card) {
			for(var i = 0 ; i < game.length ; i++) {
				if(card[key][i] == number) {
					console.log("Number present " + value);
					// check if the number is already marked
					if(presentNums[number] != undefined ) {
						continue;
					}
					presentNums[number] = 1;
					verticalCount[key] == undefined ? verticalCount[key] = 1 : verticalCount[key]++;
					horizontalCount[i] == undefined ? horizontalCount[i] = 1 : horizontalCount[i]++;
					console.log(" Current state ");
					console.log(verticalCount);
					console.log(horizontalCount);
					if(verticalCount[key] == game.length || horizontalCount[i] == game.length) {
						client.emit('bingo');
						return;
					}
				}
			}
		}
	});

client.on('win', function (message) { 
	console.log("Yayy won the game!!! " + message); 
	});

client.on('lose', function (message) { 
	console.log("Lost!! " + message); 
	});

client.on('disconnect', function () { 
	console.log("Disconnected from server");
	});
