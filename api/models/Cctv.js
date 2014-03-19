/**
 * Cctv
 *
 * @module      :: Model
 * @description :: CCTV camera. Only the position (latitude, longitude) is required to store the object.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // format: [latitude,longitude]
    location: { 
      type: 'array',
      array: true,
      required: true
    },
    // 'normal' or 'panorama'(360°) cam
    model: 'string', 
    // private or public
    owner: 'string', 
    angle: 'integer', 
  }
};