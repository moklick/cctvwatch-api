/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */
var path = require("path"),
    pkg = require(path.resolve(__dirname, '..', 'package.json'));

module.exports.adapters = {
  'default': 'mongo',

  mongo: {
    module: 'sails-mongo',
    host: pkg.config.adapter.host,
    port: pkg.config.adapter.port,
    user: pkg.config.adapter.user,
    password: pkg.config.adapter.password,
    database: pkg.config.adapter.database,

    schema : true // default is false because usually mongo is schemaless!
  }
};
