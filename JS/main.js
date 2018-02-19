

var inLocations = [
  {
    name : "NiNO",
    lat: "24.7981474",
    lang:"46.6548023",
    type: "restaurant",
    open:"00",
    close:"00"

  },
  {
    name : "karam cafe",
    lat:"24.7985459",
    lang: "46.654274",
    type:"Cafe",
    open:"00",
    close:"00"
  },
  {
    name :"Subway",
    lat: "24.795477",
    lang:"46.655884",
    type:"restaurant",
    open:"00",
    close:"00"
  },
  {
    name : "RECIPE Café",
    lat:"24.795249",
    lang:"46.655139",
    type:"Cafe",
    open:"00",
    close:"00"
  },
  {
    name :"McDonald's",
    lat:"24.794305",
    lang:"46.655678",
    type:"restaurant",
    open:"00",
    close:"00"
  },
  {
    name :"Tutti Cafe",
    lat:"24.795348",
    lang:"46.656106",
    type:"Cafe",
    open:"00",
    close:"00"
  },

];






var Locations = function(data) {
  var loc = this;

  loc.lat = ko.observable(data.lat);
  loc.lang = ko.observable(data.lang);
  loc.name = ko.observable(data.name);
  loc.type = ko.observable(data.type);

};//end of locations function







var ViewModel=function(){
var self = this;

var map;


var latlang = new google.maps.LatLng(24.797043, 46.655338);

map = new google.maps.Map(document.getElementById('map'), {
  center: latlang,
  zoom: 17

});


this.resLsit = ko.observableArray([]);
this.cofLsit = ko.observableArray([]);


this.Locationslist = ko.observableArray([]);
this.returnList = ko.observableArray([]);

inLocations.forEach(function(index) {
  if (index.type == "restaurant") {
    self.resLsit().push(new Locations(index));
  } else if (index.type == "Cafe") {
    self.cofLsit().push(new Locations(index));

  }
  self.Locationslist().push(new Locations(index));
});
self.returnList= ko.observableArray(self.Locationslist());
this.currentLocation = ko.observable(this.Locationslist()[0]);


//map handling

//markers
self.Locationslist().forEach(function(item) {
  item.pp = ko.observable(new google.maps.LatLng(item.lat(), item.lang()));
  item.marker = ko.observable(new google.maps.Marker({
    position: item.pp(),
    map: map,
    animation: google.maps.Animation.DROP
  }));
  item.marker().addListener('click', function() {

    self.markerAnimation(item);

  });



});

//to set the animation and send creat the InfoWindow
self.markerAnimation = function(item){


//ajax call first
  $.ajax({

      // The URL for the request
      url: "https://api.foursquare.com/v2/venues/43695300f964a5208c291fe3/hours?ll=" + item.lat()+","+item.lang() + "&client_id=Q10RHT2AAAAYARCOTUXBASIBODFSB0A1Y0SRZMALVHKDHCWP&client_secret=MJIERSD5GLP34P33KROA1YWYXJMWQ00B0NHEUZVSG0KRDCIZ&v=20180213",


      // Whether this is a POST or GET request
      type: "GET",

      // The type of data we expect back
      dataType : "json",
  })
    // Code to run if the request succeeds (is done);
    // The response is passed to the function
    .done(function( json ) {
      var open =json.response.hours.timeframes[0].open[0].start;
      var close=json.response.hours.timeframes[0].open[0].end;

      item.close = ko.observable(close);
      item.open =ko.observable(open);



      //then creat the window
          item.infowindow = ko.observable (new google.maps.InfoWindow({
            maxHight: 400,
            pixelOffse: 400,
            content: '<div id="content">' + '<p>...<p>' +
              '<div id="siteNotice">' +
              '</div>' +
              '<h1 id="firstHeading" class="firstHeading">' + item.name() + '</h1>' +
              '<div id="bodyContent">' + "<h6>" + item.type() + "</h6>" +
              '<div id="col-md-4">' + "<div>opens at</div>" + "<div>" + item.open() + "</div>" +
              '<div id="col-md-4">' + "<div>closes at</div>" + "<div>" + item.close() + "</div>"


          }));






        item.marker().setAnimation(google.maps.Animation.BOUNCE);

        item.infowindow().open(map,item.marker());

        setTimeout(function(){ item.marker().setAnimation(null); }, 1550);





    })//end of done

    // Code to run if the request fails; the raw request and
    // status codes are passed to the function
    .fail(function( xhr, status, errorThrown ) {

            item.close = ko.observable( "error with API CALL");

            item.open=ko.observable("--");
    })//end of fail














};





//window












//when the name clicked the marker do the animations
this.markerevent = function(clicked) {

  self.Locationslist().forEach(function(item) {

    if (clicked.name() == item.name()) {
      self.markerAnimation(item);
    }

  });
};








//restaurantsLsit pushed in result list and showresturants markers

this.restaurantsLsit = function() {

  self.returnList(self.resLsit());
  var Bound = new google.maps.LatLngBounds();

  self.Locationslist().forEach(function(item) {
    if (item.type() == "Cafe") {

      item.marker().setMap(null);

    } else {
      item.marker().setMap(map);

    }
    Bound.extend(item.marker().position);
  });

};
//ALLlsit push all the list in result list and  to show all markers

this.ALLlsit = function() {

  self.returnList(self.Locationslist());

  var Bound = new google.maps.LatLngBounds();
  self.Locationslist().forEach(function(item) {
    item.marker().setMap(map);
    Bound.extend(item.marker().position);

  });
  map.fitBounds(Bound);

};
//pushed the coffee list in result list and show coffee markers

this.coffeeLsit = function() {

  self.returnList(self.cofLsit());

  var Bound = new google.maps.LatLngBounds();

  self.Locationslist().forEach(function(item) {
    if (item.type() == "restaurant") {

      item.marker().setMap(null);

    } else {
      item.marker().setMap(map);

    }
    Bound.extend(item.marker().position);
  });
};



};



function errorHandlingMap() {
    $('#map').html('Error with google API');
}

var startapp =function(){
ko.applyBindings(new ViewModel());
};
