module.exports = {

	parseLocationString : function(locationString){
		var location = locationString.split(',');
		return [ parseFloat(location[0]),parseFloat(location[1]) ];
	}

}