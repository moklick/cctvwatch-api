// Start sails and pass it command line arguments
var path = require('path'),
	config = require(path.resolve(__dirname, 'api', 'services', 'ConfigManager')).getConfig();
require('sails').lift({
  prod: config.production,
  hooks: {
    sockets: false,
    pubsub: false
  }});
