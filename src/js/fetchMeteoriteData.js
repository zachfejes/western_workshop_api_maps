function fetchMeteoriteData(callback) {
    let url = 'https://data.nasa.gov/resource/gh4g-9sfh.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            let cleanData = xhr.response.filter(x => x.geolocation && x.mass);

            callback(null, cleanData);
        } 
        else {
            callback(status, xhr.response);
        }
    };

    xhr.send();
}


function convertToGeoJson(meteoriteData) {
    let geoJson = {
        type: "FeatureCollection",
        features: []
    };

    for(let i = 0; i < meteoriteData.length; i++) {
        let meteorite = meteoriteData[i];

        geoJson.features.push({
            type: "Feature",
            properties: meteorite,
            geometry: {
                type: "Point",
                coordinates: [ parseFloat(meteorite.geolocation.longitude), parseFloat(meteorite.geolocation.latitude) ]
            }
        });
    }

    return geoJson;
}