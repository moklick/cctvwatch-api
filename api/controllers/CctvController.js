/**
 * CctvController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	_config: {},

	near: function(req, res) {
		var lat = parseFloat(req.param('lat')),
			lng = parseFloat(req.param('lng')),
			maxDistance = req.param('maxDistance') || 1000,
			limit = req.param('limit') || 30;

		Cctv.native(function(err, collection) {
			/*
			 * geoNear function defined in node-mongodb-native (see https://github.com/mongodb/node-mongodb-native/blob/dd7bb687749ffab6ec4c4a6b052ef2cdffc0d780/lib/mongodb/collection.js#L1446)
			 * also see MongoDoc http://docs.mongodb.org/manual/reference/command/geoNear/
			 *
			 * Execute the geoNear command to search for items in the collection
			 *
			 * Options
			 *  - **num** {Number}, max number of results to return.
			 *  - **maxDistance** {Number}, include results up to maxDistance from the point.
			 *  - **distanceMultiplier** {Number}, include a value to multiply the distances with allowing for range conversions.
			 *  - **query** {Object}, filter the results by a query.
			 *  - **spherical** {Boolean, default:false}, perform query using a spherical model.
			 *  - **uniqueDocs** {Boolean, default:false}, the closest location in a document to the center of the search region will always be returned MongoDB > 2.X.
			 *  - **includeLocs** {Boolean, default:false}, include the location data fields in the top level of the results MongoDB > 2.X.
			 *  - **readPreference** {String}, the preferred read preference ((Server.PRIMARY, Server.PRIMARY_PREFERRED, Server.SECONDARY, Server.SECONDARY_PREFERRED, Server.NEAREST).
			 *
			 * @param {Number} x point to search on the x axis, ensure the indexes are ordered in the same order.
			 * @param {Number} y point to search on the y axis, ensure the indexes are ordered in the same order.
			 * @param {Objects} [options] options for the map reduce job.
			 * @param {Function} callback this will be called after executing this method. The first parameter will contain the Error object if an error occured, or null otherwise. While the second parameter will contain the results from the geoNear method or null if an error occured.
			 * @return {null}
			 * @api public
			 */
			collection.geoNear(lng, lat, {
				limit: limit,
				maxDistance: maxDistance, // in meters
				//query: {}, // allows filtering
				distanceMultiplier: 3959, // converts radians to miles (use 6371 for km)
				spherical: true
			}, function(mongoErr, docs) {
				if (mongoErr) {
					console.error(mongoErr);
					res.serverError(mongoErr);
				} else {
					//        res.send('proximity successful, got '+docs.results.length+' results.');
					res.json(docs.results);
				}
			});
		});
	},

	// within using native and find($geoWithin)
	within: function(req, res) {

		var north = parseFloat(req.param('north')),
			west = parseFloat(req.param('west')),
			south = parseFloat(req.param('south')),
			east = parseFloat(req.param('east')),
			limit = req.param('limit') || 30;

		console.log([north, east, south, west]);
		Cctv.native(function(err, collection) {
			collection.find({
				'location.center': {
					$geoWithin: { // see http://docs.mongodb.org/manual/reference/operator/geoWithin/#op._S_geoWithin
						$geometry: {
							type: 'Polygon',
							coordinates: [ // use format [lng, lat]
								[
									[west, north],
									[east, north],
									[east, south],
									[west, south],
									[west, north]
								]
							]
						}
					}
				}
			})
				.toArray(function(mongoErr, docs) {
					if (mongoErr) {
						res.serverError(mongoErr);
					} else {
						//        res.send('within successful, got '+docs.results.length+' results.');
						res.json(docs);
					}
				});
		});
	}
};