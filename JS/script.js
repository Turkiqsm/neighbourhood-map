	$.ajax({
  		type: "GET",
  		url: "https://api.foursquare.com/v2/venues/43695300f964a5208c291fe3/hours?&oauth_token=D2IUDWHJD53ATIVX1HMPOME5SLV3G3QKFXHOGX01KZ5CMIUX&v=20180213&ll=24.7985459,46.654274",
  		success: function(data) {
			var dataobj = data.response.groups[0].items;

			$.foreach( dataobj, function() {
consle.log(dataobj)

			});
		}
	});
