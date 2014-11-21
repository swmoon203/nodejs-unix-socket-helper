var http = require('http'),
	unixSocket = require("unix-socket");

var server = http.Server();

var option = { 
	path: "/var/run/shm/nodejs/server.sock",
	mode: 0666 
};

unixSocket.listen(server, option, function(result) {
	if (result) {
		console.log('Server started on ' + result);
	} else {
		console.error('Error');
		process.exit(0);
	}
});