/**
 * Cctv
 *
 * @module      :: Model
 * @description :: CCTV camera. Only the position (latitude, longitude) is required to store the object.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    name: 'string',
    description: 'string',
    // format: [latitude,longitude]
    location: {
      type: 'array',
      array: true,
      required: true
    },
    note: 'string',
    // indoor, outdoor or webcam
    type: 'string',
    // 'normal' or 'panorama'(360°) cam
    model: 'string',
    // private or public
    operator: 'string',
    angle: 'integer',
    url: 'url',
    category: 'string',
    fixme: 'boolean',
    osmID: 'integer'
  }, 
  beforeValidation: function(values, cb) {
    values.location = LocationHelper.parseLocationString(values.location);
    cb();
  },
};