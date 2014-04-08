#!/usr/bin/env node
'use strict';
var request = require('request'),
	_ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	JSONStream = require('JSONStream'),
	es = require('event-stream'),
	writeStream = fs.createWriteStream(path.resolve(__dirname, '..', '..', 'data', 'data.json')),
	pkg = require(path.resolve(__dirname, '..', '..', 'package.json'));

var baseURL = 'http://overpass-api.de/',
	queryURL = 'api/interpreter?data=',
	query = '<osm-script output="json"> <union> <query type="node"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="' + pkg.config.bbox.lat1 + '" w="' + pkg.config.bbox.lon1 + '" n="' + pkg.config.bbox.lat2 + '" e="' + pkg.config.bbox.lon2 + '"/> </query> <query type="way"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="' + pkg.config.bbox.lat1 + '" w="' + pkg.config.bbox.lon1 + '" n="' + pkg.config.bbox.lat2 + '" e="' + pkg.config.bbox.lon2 + '"/> </query> <query type="relation"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="' + pkg.config.bbox.lat1 + '" w="' + pkg.config.bbox.lon1 + '" n="' + pkg.config.bbox.lat2 + '" e="' + pkg.config.bbox.lon2 + '"/> </query> </union> <print mode="body"/> <recurse type="down"/> <print mode="skeleton"/> </osm-script>';


var writeData = function(data) {
	var lat = data.lat,
		lng = data.lon,
		isValidData = (typeof lat !== 'undefined' && lat !== '') &&
					(typeof lng !== 'undefined' && lng !== '') &&
					(typeof data.tags !== 'undefined');

	if (isValidData) {
		// TODO: Explore more fields from the OSM API
		var entry = {
				location: [parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))],
				name: data.tags.name,
				description: data.tags.description,
				url: data.tags['url:webcam'] || data.tags.webcam || data.tags.website,
				type: data.tags.surveillance,
				operator: data.tags.operator,
				osmID: data.id,
				fixme: (typeof data.tags.fixme !== 'undefined') ? true : null
			};

		entry = _.omit(entry, function(value) {
			return value === undefined;
	    });

		Cctv.find({'osmID': entry.osmID}).done(function(err, cctv) {
			if (err) {
				return console.log(err);
			} else if (cctv.length === 0) {
				Cctv.create(entry, function(err, cctv) {
				  if (err) return console.log(err);
				});
			}
		});

		this.emit('data', data);
	}
};

function tap() {
	return es.through(writeData);
}

request({url: baseURL + queryURL + query})
	// parse interesting elements
	.pipe(JSONStream.parse('elements.*'))
	.pipe(tap())
	// write back to string
	.pipe(JSONStream.stringify(false))
	// write to the filesystem
	.pipe(writeStream);

writeStream.on('close', function(){
	console.info('OSM data synced !');
});