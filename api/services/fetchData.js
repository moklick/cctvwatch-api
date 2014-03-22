#!/usr/bin/env node

var request = require('request'),
	fs = require('fs'),
	path = require('path'),
	JSONStream = require('JSONStream'),
	es = require('event-stream'),
	writeStream = fs.createWriteStream(path.resolve(__dirname, '..', '..', 'data', 'data.json')),
	pkg = require(path.resolve(__dirname, '..', '..', 'package.json')),
	connection = 'mongodb://' + pkg.config.adapter.user + ':' + pkg.config.adapter.password + '@' + pkg.config.adapter.host + ':' + pkg.config.adapter.port + '/' + pkg.config.adapter.database,
	MongoClient = require('mongodb').MongoClient,
	mongodb = {};

MongoClient.connect(connection, function(err, db) {
	if (err) throw err;
	mongodb = db;
})

var baseURL = 'http://overpass-api.de/',
	queryURL = 'api/interpreter?data=',
	query = '<osm-script output="json"> <union> <query type="node"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="' + pkg.config.bbox.lat1 + '" w="' + pkg.config.bbox.lon1 + '" n="' + pkg.config.bbox.lat2 + '" e="' + pkg.config.bbox.lon2 + '"/> </query> <query type="way"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="' + pkg.config.bbox.lat1 + '" w="' + pkg.config.bbox.lon1 + '" n="' + pkg.config.bbox.lat2 + '" e="' + pkg.config.bbox.lon2 + '"/> </query> <query type="relation"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="' + pkg.config.bbox.lat1 + '" w="' + pkg.config.bbox.lon1 + '" n="' + pkg.config.bbox.lat2 + '" e="' + pkg.config.bbox.lon2 + '"/> </query> </union> <print mode="body"/> <recurse type="down"/> <print mode="skeleton"/> </osm-script>';

var writeData = function write(data) {
	var lat = data.lat,
		lng = data.lon,
		isValidData = (typeof lat !== 'undefined' && lat !== '') && (typeof lng !== 'undefined' && lng != '');

	if (isValidData) {
		var location = [parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))];

		mongodb.collection('cctv').update({_id: location.join('').replace(/\./g, '')},
			{location: location, _id: location.join('').replace(/\./g, '')},
			{upsert: true},
			function(err, cctv) {
				if (err) throw err;
		});

		this.emit('data', data);
	}
}

function tap() {
	return es.through(writeData);
}

request({url: baseURL + queryURL + query})
// parse interesting elements
.pipe(JSONStream.parse("elements.*"))
.pipe(tap())
// write back to string
.pipe(JSONStream.stringify(false))
// write to the filesystem
.pipe(writeStream);

writeStream.on('close', function(){
	console.log("Saved !");
	mongodb.close();
});