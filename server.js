/////////////////////////////////////////////////////////////////////////////
//YUNSOCKET																   //
//nodejs, serialport and socket.io to create a webserver on the arduino Yun// 
//and have full controll of the arduino chip through an online interface.  //
//Created By fito_segrera												   //
//web: fii.to 															   //
/////////////////////////////////////////////////////////////////////////////

////////////////////////
/// Required Modules ///
////////////////////////
var http = require('http');
var	fs = require('fs');
var	io = require('socket.io').listen(9001);
var index = fs.readFileSync('index.html');//read index.html
var SerialPort = require("serialport").SerialPort;

/////////////////////////////////////////
//// Declare Serial Port for arduino ////
/////////////////////////////////////////	
var sPort = "/dev/ttyATH0"; //This is the default serial port used internally by the arduino Yun
arduino = new SerialPort(sPort, {
	baudrate: 9600
});

///////////////////////////
//// Create the server ////
///////////////////////////
var app = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
});

///////////////////////////
///// init socket.io //////
///////////////////////////
io.sockets.on('connection', function(socket) {
	socket.on('led', function(data) {
		// sending binary data
		console.log("CLICK!");
		var ledOn = new Buffer(1); // Buffer is an array and Buffer(1) means 1 index array
		var ledOff = new Buffer(1);
		ledOn[0] = 0x01; // 1
		ledOff[0] = 0x00; // 0

		if(data === true) {
			// turn on
			arduino.write(ledOn);
			console.log('LED ON');
		} else {
			// turn off
			arduino.write(ledOff);
			console.log('LED OFF');
		}
	});
});

var receivedData, sendData;

arduino.on('open', function() {
	console.log('PORT OPEN!');
});

////////////////////////
///// receive data /////
////////////////////////
arduino.on('data', function(data) {
	receivedData += data;
	// basically says if there're 'E' and 'B' signals
	if (receivedData.indexOf('E') >= 0 && receivedData.indexOf('B') >= 0) {
		// save the data between 'B' and 'E'
		sendData = receivedData.substring(receivedData.indexOf('B') + 1, receivedData.indexOf('E'));
		receivedData = '';
		//console.log(sendData); //Uncomment for debugging
		io.sockets.emit('sensor', sendData);
	}
});

app.listen(8000);