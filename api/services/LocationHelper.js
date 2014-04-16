module.exports = {

	parseLocationString : function(locationString){
		console.log(locationString);
		var location = locationString.split(',');
		return [ parseFloat(location[0]),parseFloat(location[1]) ];
	}

}