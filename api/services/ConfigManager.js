// adapted from https://gist.github.com/kamiyam/6589335
'use strict';
module.exports = {
	getConfig: function() {
		var path = require('path'),
			config = require(path.resolve(__dirname, '..', '..', 'package')).config || {};
		try {
			var local = require(path.resolve(__dirname, '..', '..', 'local-config')).config,
				_ = require('lodash');

			_.forIn(config, function(value, key) {
				if (local[key])	config[key] = _.defaults(local[key], config[key]);
			});
			
		} catch (e) {
			
			return config;
		}
		
		return config;
	}
};