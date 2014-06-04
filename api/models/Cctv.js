/**
 * Cctv
 *
 * @module      :: Model
 * @description :: CCTV camera. Only the position (latitude, longitude) is required to store the object.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  connection: ['mongo'],
  attributes: {

    name: {type: 'string'},
    description: {type: 'string'},
    // format: [latitude,longitude]
    lat: {
      type: 'float',
      required: true
    },
    lng: {
      type: 'float',
      required: true
    },
    location: {
      type: 'array',
      array: [{lat: 'float', lng: 'float'}]
    },
    note: {type: 'string'},
    // indoor, outdoor or webcam
    type: {
      type: 'string',
      enum: ['indoor', 'outdoor', 'webcam', 'public', 'traffic']
    },
    // 'normal' or 'panorama'(360°) cam
    model: {type: 'string'},
    // private or public
    operator: {type: 'string'},
    angle: {type: 'integer'},
    url: {type: 'url'},
    category: {type: 'string'},
    fixme: {type: 'boolean'},
    osmID: {type: 'integer'}
  }, 
  beforeValidate: function(values, cb) {
    values.location = [values.lat, values.lng];
    cb();
  }
};