let westernLatLong = { lat: 43.0081693, lng: -81.2766837 };
let initialZoom = 19.76;
let heatmapData = [];
let visibleMap = false;
let map, westernMarker, dataUrl, marker, latLng, heatmap;

let mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#181818" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#1b1b1b" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c2c2c" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#8a8a8a" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#373737" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#3c3c3c" }]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{ "color": "#4e4e4e" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#3d3d3d" }]
    }
];

function initMap() {
    var styledMapType = new google.maps.StyledMapType(mapStyle);

    map = new google.maps.Map(document.getElementById("map"), {
        center: westernLatLong,
        zoom: initialZoom,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
        }
    });

    westernMarker = new google.maps.Marker({position: westernLatLong, map: map});

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    
    fetchMeteoriteData((error, response) => {
        renderHeatMap(response);
        //renderWeightMap(response);
    });
};


function toggleMap() {
    var auth2 = gapi.auth2.getAuthInstance();

    if(auth2.isSignedIn.je) {
        let mapElement = document.getElementById("map");
        visibleMap = !visibleMap;

        if(visibleMap) {
            mapElement.classList.add("show");
        }
        else {
            mapElement.classList.remove("show");
        }
    }
}


function renderHeatMap(rawData) {
    let heatmapData = [];

    for (var i = 0; i < rawData.length; i++) {
        let { geolocation, mass } = rawData[i];

        heatmapData.push({
            location: new google.maps.LatLng(geolocation.latitude, geolocation.longitude),
            weight: Math.pow(mass, 0.1)
        });
    }

    return(
        new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            dissipating: true,
            map: map,
            radius: 15,
            opacity: 0.5
        })
    );
}


function renderWeightMap(rawData) {
    let geoJsonData = convertToGeoJson(rawData);
    map.data.addGeoJson(geoJsonData);

    map.data.setStyle(function(feature) {
        var mass = feature.getProperty('mass');
        return {
            icon: renderCircle(mass)
        };
    });
}


function renderCircle(magnitude) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: 0.2,
        scale: Math.pow(magnitude, 0.25),
        strokeColor: 'white',
        strokeWeight: 0.5
    };
}