'use strict';

var map, initialLatLng, listData = [],
    success, selectedMarker = -1,
    selectedInfowindow = null;
var totalMarkers = [],
    activeMarkers = [];
var selfLocationMarker, bounds;

// Initializing the map with a default center
function initMap() {

    // Map Style taken from Snazzymaps (https://snazzymaps.com/style/38/shades-of-grey)
    // "Shades of Grey" by Adam Krogh
    var styles = [
        {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
            "saturation": 36
        }, {
            "color": "#000000"
        }, {
            "lightness": 40
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#000000"
        }, {
            "lightness": 16
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 20
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 17
        }, {
            "weight": 1.2
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 20
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 21
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 17
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 29
        }, {
            "weight": 0.2
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 18
        }]
    }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 16
        }]
    }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 19
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 17
        }]
    }];

    initialLatLng = {
        lat: initialLat,
        lng: initialLng
    };
    // Centering the map at a default location
    map = new google.maps.Map(document.getElementById('map'), {
        center: initialLatLng,
        zoom: 13,
        mapTypeControl: false,
        styles: styles
    });
}

// This function executes as a fallback when Google Maps API gives error
function googleMapErrorHandler() {
    alert("Something wrong with Google Maps API... Please Come Back Later!!");
}

// Initializing the HTML5 Geolocation to get User's location and using "ipinfo" API as fallback
var startPos;
// Default Latitude and Longitude
var initialLat = 25.310852,
    initialLng = 83.0105415;
// This function executes when user allows HTML5 Geolocation to get location
var geoSuccess = function(position) {
    startPos = position;
    initialLat = startPos.coords.latitude;
    initialLng = startPos.coords.longitude;
    initialLatLng = {
        lat: initialLat,
        lng: initialLng
    };
    getWeatherData(initialLatLng);
    getPOIData(initialLatLng);
};
// This function executes when user doesn't allow HTML5 Geolocation to get location
var geoError = function(error) {
    $.getJSON('https://ipinfo.io', function(data) {
        var location = data.loc;
        location = location.split(',');
        initialLat = Number(location[0]);
        initialLng = Number(location[1]);
        initialLatLng = {
            lat: initialLat,
            lng: initialLng
        };
        getPOIData(initialLatLng);
        getWeatherData(initialLatLng);
    }).fail(function() {
        getWeatherData(initialLatLng);
        getPOIData(initialLatLng);
    });
};
navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

// Using "apixu" API for getting Weather Information at User's location
function getWeatherData(initialLatLng) {
    var apixuURL = "https://api.apixu.com/v1/current.json"+
    "?key=YOUR_API_KEY=" + initialLatLng.lat + "," 
    + initialLatLng.lng;
    $.getJSON(apixuURL, function(data) {
        ViewModel.cityName(data.location.name);
        ViewModel.weatherCondition(data.current.temp_c + " °C - " 
            + data.current.condition.text);
        ViewModel.weatherIcon("https:" + data.current.condition.icon);
        ViewModel.weatherError(false);
    }).fail(function(err) {
        ViewModel.cityName("");
        ViewModel.weatherCondition("");
        ViewModel.weatherIcon("img/error.png");
        ViewModel.weatherError(true);
    });
}

// Using "Foursquare" API for getting Points of Interests(POIs) at User's location
function getPOIData(initialLatLng) {
    var forSquareURL = "https://api.foursquare.com/v2/venues/explore?" + 
    "sortByDistance=1" + 
    "&client_id=YOUR_CLIENT_ID" + 
    "&client_secret=YOUR_CLIENT_SECRET"+
    "&v=20130815&ll=" + initialLatLng.lat + "," + initialLatLng.lng;

    $.getJSON(forSquareURL, function(data) {
        success = data.meta.code;
        var json = data.response.groups[0].items;
        listData = [];
        var placeHolderText = "eg. ";
        for (let i = 0; i < json.length; i++) {
            var tempData;
            tempData = {};
            var venue = json[i].venue;
            tempData.id = "https://foursquare.com/v/"
                + "john-f-kennedy-international-airport-jfk/"
                + venue.id
                + "?ref=YOUR_CLIENT_ID";
            tempData.name = venue.name;
            tempData.dist = venue.distance;
            tempData.lat = venue.location.lat;
            tempData.lng = venue.location.lng;
            tempData.formattedAddress = "";
            tempData.icon = venue.categories[0].icon.prefix + "32" 
            + venue.categories[0].icon.suffix;
            tempData.bgIcon = venue.categories[0].icon.prefix + "bg_32" 
            + venue.categories[0].icon.suffix;
            for (let j = 0; j < venue.location.formattedAddress.length; j++) {
                tempData.formattedAddress += venue.location.formattedAddress[j] 
                + " ";
            }
            if (venue.rating) {
                tempData.rating = venue.rating + "/10";
            } else {
                tempData.rating = "NA";
            }
            var tips = json[i].tips;
            tempData.tips = [];
            if (tips) {
                for (let k = 0; k < tips.length; k++) {
                    tempData.tips.push(tips[k].text);
                }
            }
            tempData.show = true;
            placeHolderText += tempData.name + ", ";
            listData.push(tempData);
        }
        ViewModel.data(listData);
        placeHolderText += "etc.";
        ViewModel.placeHolderText(placeHolderText);
        setup();

    }).fail(function(err) {
        ViewModel.data([]);
        alert("Unable to get POI Data right now!! Please come back later :)");
    });
}

function setup() {
    for (let i = 0; i < listData.length; i++) {
        // Creating a marker for each of the POIs
        var marker = new google.maps.Marker({
            position: {
                lat: listData[i].lat,
                lng: listData[i].lng
            },
            animation: google.maps.Animation.DROP,
            id: i,
            title: listData[i].name,
            icon: listData[i].icon
        });
        totalMarkers.push(marker);
        activeMarkers.push(marker);
        marker.addListener('mouseover', function() {
            if (activeMarkers[selectedMarker] != this) {
                this.setIcon(listData[i].bgIcon);
            }
        });
        marker.addListener('mouseout', function() {
            if (activeMarkers[selectedMarker] != this) {
                this.setIcon(listData[i].icon);
            }
        });

        var infowindow = new google.maps.InfoWindow();
        // Closing any previous open inforwindow and opening a new infowindow for the clicked marker
        marker.addListener('click', function() {
            map.panTo(this.position);
            if (activeMarkers[selectedMarker] != this) {
                if (selectedInfowindow) {
                    selectedInfowindow.close();
                }
                if (selectedMarker != -1) {
                    if (activeMarkers[selectedMarker])
                        activeMarkers[selectedMarker].setAnimation(null);
                    if (activeMarkers[selectedMarker])
                        activeMarkers[selectedMarker].setIcon(listData[i].icon);
                }
                showInfoWindow(this, infowindow);
                selectedMarker = i;
                activeMarkers[selectedMarker].setAnimation(google.maps.Animation.BOUNCE);
                activeMarkers[selectedMarker].setIcon(listData[i].bgIcon);
                selectedInfowindow = infowindow;
            }
        });
    }
    // Marker for the location of user, created from the data got from HTML5 Geolocation or "ipinfo" API
    selfLocationMarker = new google.maps.Marker({
        position: initialLatLng,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            strokeColor: 'green'
        },
        title: 'You Are Here!',
        draggable: true
    });
    // This function executes when user changes the location of animated marker showing his/her location
    selfLocationMarker.addListener('dragend', function() {
        initialLatLng = {
            lat: selfLocationMarker.getPosition().lat(),
            lng: selfLocationMarker.getPosition().lng()
        };
        listData = [];
        for (let i = 0; i < totalMarkers.length; i++) {
            totalMarkers[i].setMap(null);
        }
        totalMarkers = [];
        selfLocationMarker.setMap(null);
        getWeatherData(initialLatLng);
        getPOIData(initialLatLng);
    });
    // Animating Self Location Marker
    animateSelfLocationMarker(selfLocationMarker);
    bounds = new google.maps.LatLngBounds();
    // Removing old markers(if any), placing new markers and adjusting the bounds of the map to fit all markers
    setMarkers(bounds, totalMarkers, selfLocationMarker);
}

// This function changes color of Self Location Marker
function animateSelfLocationMarker(selfLocationMarker) {
    setInterval(function() {
        var color = "hsl(" + Math.floor(Math.random() * 360) + "," 
        + Math.floor(Math.random() * 50 + 50) + "%," 
        + Math.floor(Math.random() * 30 + 30) + "%)";
        selfLocationMarker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            strokeColor: color
        });
    }, 500);
}

// This function removes all existing markers on the map, 
// places the markers in filtered list
// and adjusting bounds of the map to fit all markers
function setMarkers(bounds, totalMarkers, selfLocationMarker) {
    activeMarkers = [];
    for (let x = 0; x < listData.length; x++) {
        totalMarkers[x].setMap(null);
        if (listData[x].show) {
            activeMarkers.push(totalMarkers[x]);
            totalMarkers[x].setMap(map);
        }
        bounds.extend(totalMarkers[x].position);
    }
    bounds.extend(selfLocationMarker.position);
    map.fitBounds(bounds);
    google.maps.event.addDomListener(window, 'resize', function() {
      map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    });
}

// This function creates and opens the infowindow for clicked marker
function showInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        var tips = "<ul>";
        if (listData[marker.id].tips) {
            for (let i = 0; i < listData[marker.id].tips.length; i++) {
                tips += "<li>" + listData[marker.id].tips[i] + "</li>";
            }
        }
        tips += "</ul>";
        var ratings = '<p class="rating">Rating: ' + listData[marker.id].rating 
        + '</p>';
        if (listData[marker.id].rating === "NA") {
            ratings = "";
        }
        var infowindowText = '<div class="infowindow"><h1><a target="_blank" href="' 
        + listData[marker.id].id + '">' + marker.title 
        + '</a></h1>' + '<p>' + ratings + listData[marker.id].formattedAddress 
        + '</p>' + tips + '</div>';

        infowindow.setContent(infowindowText);
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

// ViewModel for our Knockout
var ViewModel = {
    filterText: ko.observable(""),
    // Data that is displayed in the list of POIs
    data: ko.observableArray(listData),
    // This function opens up the infowindow for selected marker and closes 
    //and other infowindow which was previously open
    selectMarker: function(index) {
        if (selectedInfowindow) {
            selectedInfowindow.close();
        }
        if (selectedMarker != -1) {
            if (activeMarkers[selectedMarker]) {
                activeMarkers[selectedMarker].setAnimation(null);
                activeMarkers[selectedMarker].setIcon(ViewModel.data()[selectedMarker].icon);
            }
        }
        var infowindow = new google.maps.InfoWindow();
        showInfoWindow(activeMarkers[index], infowindow);
        if (activeMarkers[index]) {
            activeMarkers[index].setAnimation(google.maps.Animation.BOUNCE);
            activeMarkers[index].setIcon(ViewModel.data()[index].bgIcon);
        }
        selectedMarker = index;
        selectedInfowindow = infowindow;
    },
    // This function filters our list of POIs based on the input keyword
    filterList: function() {
        var text = ViewModel.filterText();
        ViewModel.data([]);
        if (selectedInfowindow) {
            selectedInfowindow.close();
        }
        if (text) {
            for (let i = 0; i < listData.length; i++) {
                if (listData[i].name.toLowerCase().indexOf(text.toLowerCase()) == -1) {
                    listData[i].show = false;
                    setMarkers(bounds, totalMarkers, selfLocationMarker);
                } else {
                    listData[i].show = true;
                    ViewModel.data.push(listData[i]);
                    setMarkers(bounds, totalMarkers, selfLocationMarker);
                }
            }
        } else {
            for (let i = 0; i < listData.length; i++) {
                listData[i].show = true;
                ViewModel.data.push(listData[i]);
                setMarkers(bounds, totalMarkers, selfLocationMarker);
            }
        }

        if (activeMarkers[selectedMarker]) {
            activeMarkers[selectedMarker].setAnimation(null);
            activeMarkers[selectedMarker].setIcon(ViewModel.data()[selectedMarker].icon);
        }
    },
    // Keeps track of Neighbourhood as obtained from "apixu" weather API
    cityName: ko.observable(),
    // This observable stores the weather information got from "apixu" API 
    weatherCondition: ko.observable(),
    // Stores icon for current weather
    weatherIcon: ko.observable("img/error.png"),
    // This observable becomes true when an error occurs while loading weather data using "apixu" API
    weatherError: ko.observable(false),
    // Keeps track of wheather the Menu bar should be shown or not
    showMenu: ko.observable(false),
    // This function shows/hides menu based on value of showMenu observable
    toggleMenu: function() {
        ViewModel.showMenu(!ViewModel.showMenu());
    },
    placeHolderText: ko.observable(""),
    showAttribution: ko.observable(false),
    toggleAttribution: function() {
        ViewModel.showAttribution(!ViewModel.showAttribution());
    }
};

// Binding the ViewModel once DOM is ready
$(function() {
    ko.applyBindings(ViewModel);
});