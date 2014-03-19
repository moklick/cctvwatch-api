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

var helper = require('../services/helper');

module.exports = {

	_config: {},

	/** 
	 * returns cctvs within the given bounding-box [bottomLeft,topRight]
	 * @param  Request req 
	 * @param  Response res
	 */
	within: function(req, res) {
		var	bottomLeft = req.query.bottomleft,
			topRight = req.query.topright;

		// return 404 if query is not complete	
		if (!bottomLeft || !topRight) return res.send('pass points southwest and northeast.', 404);

		// convert from '52.23,13.23' to [52.23,13.23], we can't use split here, because we need floats
		bottomLeft = helper.parseLocationString(bottomLeft);
		topRight = helper.parseLocationString(topRight);

		// use native mongodb query https://github.com/balderdashy/sails-mongo/issues/21#issuecomment-20765896 
		Cctv.native(function(err, cctvCollection) {
			// find cctvs where location within bounding-box [bottomLeft,topRight]
			cctvCollection.find({
				location :{
					$geoWithin: {
						$box: [
							bottomLeft,
							topRight
						]
					}
				}
			}).toArray(function(err, cctvs) {
				if(err) return res.send(500);
				res.send(cctvs, 200);
			});
		});
	}
};