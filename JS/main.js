

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




  $.ajax({
    type: "GET",
    url: 'https://api.foursquare.com/v2/venues/43695300f964a5208c291fe3/hours?ll=' + data.lat+','+data.lang + '&client_id=Q10RHT2AAAAYARCOTUXBASIBODFSB0A1Y0SRZMALVHKDHCWP&client_secret=MJIERSD5GLP34P33KROA1YWYXJMWQ00B0NHEUZVSG0KRDCIZ&v=20180213',
    async:false,
    data: 'JSON',

    success: function(result, status) {
      var open =result.response.hours.timeframes[0].open[0].end;
      var close=result.response.hours.timeframes[0].open[0].start;

      loc.close = ko.observable(open);
      loc.open =ko.observable(close);






    },

    error: function(result, status, err) {
      //run only the callback without attempting to parse result due to error

      loc.close = ko.observable( "error with API CALL");

      loc.open=ko.observable("--");
    },
    dataType: "json"
  });


  console.log(loc.open());


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


self.markerAnimation = function(item){





  item.marker().setAnimation(google.maps.Animation.BOUNCE);

  item.infowindow().open(map,item.marker());

  setTimeout(function(){ item.marker().setAnimation(null); }, 1550);


};





//window

self.Locationslist().forEach(function(item) {

  console.log(item.open());
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


});










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
