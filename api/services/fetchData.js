#!/usr/bin/env node
var request = require('request'),
	fs = require('fs'),
	path = require('path'),
	JSONStream = require('JSONStream');

var baseURL = 'http://overpass-api.de/',
	queryURL = 'api/interpreter?data=',
	lat1 = '52.505407689237956',
	lon1 = '13.366413116455078',
	lat2 = '52.52867622324605',
	lon2 = '13.411345481872559',
	query = '<osm-script output="json"> <union> <query type="node"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="' + lat1 + '" w="' + lon1 + '" n="' + lat2 + '" e="' + lon2 + '"/> </query> <query type="way"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="' + lat1 + '" w="' + lon1 + '" n="' + lat2 + '" e="' + lon2 + '"/> </query> <query type="relation"> <has-kv k="man_made" v="surveillance"/> <bbox-query s="52.505407689237956" w="13.366413116455078" n="52.52867622324605" e="13.411345481872559"/> </query> </union> <print mode="body"/> <recurse type="down"/> <print mode="skeleton"/> </osm-script>';

request({url: baseURL + queryURL + query})
	// parse interesting elements
	.pipe(JSONStream.parse("elements"))
	// write back to string
    .pipe(JSONStream.stringify(false))
    // write to the filesystem
    .pipe(fs.createWriteStream(path.resolve(__dirname, '..', '..', 'data', 'data.json')));

console.log("Saved!");