var express = require('express');
var jwt = require('jsonwebtoken');
var logger = require('morgan');
var bodyParser = require('body-parser');
var url = require('url')

var http = require('http')
var WebSocketServer = require('ws').Server

var app = express();
var path = require('path')
var protect = require('./protect');
var api = require('./api');
const g = {api, protect}
process.env.PORT = process.env.PORT || 8668;

process.on('uncaughtException', function (err) {
	console.error(err);
	console.error(err.stack);
});

var server = http.createServer(app).listen(process.env.PORT, () => {
	console.log("server run on Port %d.", server.address().port);
});
var wss = new WebSocketServer({ server: server, path: '/ws' })

wss.on('connection', function connection(ws) {
	var location = url.parse(ws.upgradeReq.url, true);
	// you might use location.query.access_token to authenticate or share sessions
	// or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});
	ws.send('something')

});

app.use('/users', express.static(__dirname + '/users'))
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.raw({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'5mb'}));

app.use(logger('dev'));

app.use((req, res, next) => {
	res.header('Access-Control-Origin', '*')
	res.header('Access-Control-Methods', 'PUT,POST,GET')
	// res.header('Content-Type', "application/json;charset=utf-8")
	next();
})

app.all('/', (req, res, next) => {
	res.end('Hi Njnu!');
})


app.use('/api', g.api);

app.use('/protect', g.protect);

module.exports = app

app.all('/pull', (req, res) => {
	// req.socket.setTimeout(Infinity);
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	var ls = require('child_process').spawn('git', ['pull', 'origin', 'master'])
	ls.stdout.on('data', (data) => {
		data = data.toString()
		console.log(data)
		res.write(`${data}`);
	});

	ls.stderr.on('data', (data) => {
		data = data.toString()
		console.log(data)
		res.write(`${data}`);
	});
	ls.on('close', (code) => {
		console.log(`child process exited with code ${code}`)
		res.end(`child process exited with code ${code}`);
	});

})

app.all('/npmi', (req, res) => {
	// req.socket.setTimeout(Infinity);
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	var ls = require('child_process').spawn('cnpm', ['install'])
	ls.stdout.on('data', (data) => {
		data = data.toString()
		console.log(data)
		res.write(`${data}`);
	});

	ls.stderr.on('data', (data) => {
		data = data.toString()
		console.log(data)
		res.write(`${data}`);
	});
	ls.on('close', (code) => {
		console.log(`child process exited with code ${code}`)
		res.end(`child process exited with code ${code}`);
	});

})

function cleanCache(modulePath) {
	var module = require.cache[modulePath];
	// remove reference in module.parent
	if (module.parent) {
		module.parent.children.splice(module.parent.children.indexOf(module), 1);
	}
	require.cache[modulePath] = null;
}

/*

require('fs').watch(path.resolve('./api.js'), function () {
	cleanCache(require.resolve('./api.js'));
	try {
		g.api = require('./api')
	} catch (ex) {
		console.error('module update failed', ex.message);
	}
});

require('fs').watch(path.resolve('./protect.js'), function () {
	cleanCache(require.resolve('./protect.js'));
	try {
		g.protect = require('./protect')
	} catch (ex) {
		console.error('module update failed', ex.message);
	}
});
*/