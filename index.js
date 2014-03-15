var express = require('express'),
	config = require('./config'), // not yet in use
	app = express();

app.set('port', process.env.PORT || 9000);

// enable cros origin requests
// http://stackoverflow.com/a/9429405
app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.get('/', function(req, res) {
	res.send('use http://localhost:' + app.get('port') + '/cctvs to get the data.');
});

app.get('/cctvs', function(req, res) {
	res.sendfile('./data/cctvs.json');
});

app.put('/cctvs/add/:position', function(req, res) {
	console.log(req.params.position);
	res.send(200);
});

console.log('*** started cctvwatch-api. ***\nServer is listening on port ' + app.get('port'));

app.listen(app.get('port'));