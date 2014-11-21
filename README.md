# Unix socket helper (for linux)
> Node.js has UNIX domain socket issue 

> https://gist.github.com/dshaw/9f93cdcd3a77b9142e51

##Installation
```javascript
npm install 
```

##Usage
```javascript
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
```

##Option
```javascript
var option = { 
	path: "/var/run/shm/nodejs/server.sock",
	mode: 0666 
};

//or

var option = { 
	path: [ "/var/run/shm/nodejs/server1.sock", "/var/run/shm/nodejs/server2.sock" ]
	mode: 0666 
};
```

##Methods
###isStreamOpen(path, [callback]) return boolean
```javascript
var result = unixSocket.isStreamOpen(path);

//or

unixSocket.isStreamOpen(path, function(result) {

});
```
###prepareStream(path, [callback]) return boolean
```javascript
var result = unixSocket.prepareStream(path);

//or

unixSocket.prepareStream(path, function(result) {

});
```
###availableStream(paths, [callback]) return path(string)
```javascript
var tryList = [ "/var/run/shm/nodejs/server1.sock", "/var/run/shm/nodejs/server2.sock" ];
var path = unixSocket.availableStream(tryList);

//or

unixSocket.availableStream(tryList, function(path) {

});
```
###listen(server, option, callback)
Prepare unix socket, unlink first if exists.

##Issue
###Permission denied (from Nginx)
> connect() to unix:/var/run/shm/nodejs/server.sock failed (13: Permission denied) while connecting to upstream, client...

```
chmod 777 /tmp/app.socket
```
http://serverfault.com/questions/316157/how-do-i-configure-nginx-proxy-pass-node-js-http-server-via-unix-socket?answertab=votes#tab-top



