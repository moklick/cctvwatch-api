// Start sails and pass it command line arguments
require('sails').lift({
  hooks: {
    sockets: false,
    pubsub: false
  }});
