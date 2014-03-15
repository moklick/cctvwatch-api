var express = require('express'),
	config = require('./config'),
	app = express();

app.get('/', function(req,res){
	res.send('use http://localhost:' + config.port + '/cctvs to get the data.');
});

app.get('/cctvs', function(req,res){
	res.sendfile('./data/cctvs.json');
});

app.listen(config.port);