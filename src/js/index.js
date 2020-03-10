let westernLatLong = { lat: 43.0081693, lng: -81.2766837 };
let initialZoom = 19.76;
let heatmapData = [];
let map, westernMarker, dataUrl, marker, latLng, heatmap;

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } 
        else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: westernLatLong,
        zoom: initialZoom
    });

    westernMarker = new google.maps.Marker({position: westernLatLong, map: map});
    dataUrl = 'https://data.nasa.gov/resource/gh4g-9sfh.json';
    
    getJSON(dataUrl, function(error, response) {
        // let geoJsonData = convertToGeoJson(response);
        // map.data.addGeoJson(geoJsonData);

        for (var i = 0; i < response.length; i++) {
            let { geolocation, mass } = response[i];

            if(geolocation && mass) {
                latLng = new google.maps.LatLng(geolocation.latitude, geolocation.longitude);
                heatmapData.push({
                    location: latLng,
                    weight: Math.pow(mass, 0.2)
                });
            }
        }

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            dissipating: true,
            map: map
        });

        // map.data.setStyle(function(feature) {
        //     var mass = feature.getProperty('mass');
        //     return {
        //         icon: getCircle(mass)
        //     };
        // });
    });
};


// function convertToGeoJson(meteoriteData) {

//     console.log("meteoriteData: ", meteoriteData);

//     let geoJson = {
//         type: "FeatureCollection",
//         features: []
//     };

//     for(let i = 0; i < meteoriteData.length; i++) {
//         let meteorite = meteoriteData[i];

//         if(meteorite.geolocation && meteorite.mass) {
//             geoJson.features.push({
//                 type: "Feature",
//                 properties: meteorite,
//                 geometry: {
//                     type: "Point",
//                     coordinates: [ parseFloat(meteorite.geolocation.longitude), parseFloat(meteorite.geolocation.latitude) ]
//                 }
//             });
//         }
//     }

//     return geoJson;
// }


// function getCircle(magnitude) {
//     return {
//         path: google.maps.SymbolPath.CIRCLE,
//         fillColor: 'red',
//         fillOpacity: 0.2,
//         scale: Math.pow(magnitude, 0.25),
//         strokeColor: 'white',
//         strokeWeight: 0.5
//     };
// }
