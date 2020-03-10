let westernLatLong = { lat: 43.0081693, lng: -81.2766837 };
let initialZoom = 19.76;
let heatmapData = [];
let map, westernMarker, dataUrl, marker, latLng, heatmap;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: westernLatLong,
        zoom: initialZoom
    });

    westernMarker = new google.maps.Marker({position: westernLatLong, map: map});
    
    fetchMeteoriteData((error, response) => {
        renderHeatMap(response);
        //renderWeightMap(response);
    });
};



function renderHeatMap(rawData) {
    let heatmapData = [];

    for (var i = 0; i < rawData.length; i++) {
        let { geolocation, mass } = rawData[i];

        heatmapData.push({
            location: new google.maps.LatLng(geolocation.latitude, geolocation.longitude),
            weight: Math.pow(mass, 0.2)
        });
    }

    return(
        new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            dissipating: true,
            map: map
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