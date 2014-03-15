var express = require('express'),
	config = require('./config'),
	app = express();

// enable cros origin requests
// http://stackoverflow.com/a/9429405
app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.get('/', function(req, res) {
	res.send('use http://localhost:' + config.port + '/cctvs to get the data.');
});

app.get('/cctvs', function(req, res) {
	res.sendfile('./data/cctvs.json');
});

app.put('/cctvs/add/:position', function(req, res) {
	console.log(req.params.position);
	res.send(200);
});

app.listen(config.port);