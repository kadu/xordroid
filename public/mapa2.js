function dataUpdate() {
  fetch('http://localhost:3000/api/')
    .then((response) => response.json())
    .then((json) => {
      let allLngs = [];
      json.map((row) =>{
        let marker = L.marker([row.lat,row.long]);
        var latLngs = [ marker.getLatLng() ];
        allLngs.push(marker.getLatLng());
        var markerBounds = L.latLngBounds(latLngs);
        marker.addTo(mymap).bindPopup(`<b>${row.city}</b><br />${parseFloat(row.temp).toFixed(1)} ºC`).openPopup();
        mymap.fitBounds(markerBounds);
      });

    setTimeout(() => {
      var bounds = new L.LatLngBounds(allLngs);
      if(allLngs.length === 0) return;
      mymap.fitBounds(bounds, {
      });
    }, 5000);
  });
}

var mymap = L.map('map').setView([-22.564848,-47.4094343], 3);
var maxView = L.latLngBounds(L.latLng(84.118592, -179.816080) , L.latLng(-56.036033, 176.794108));

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  maxZoom: 16,
  minZoom: 1,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  maxBounds: maxView,
  accessToken: 'pk.eyJ1Ijoia2FkdWJyIiwiYSI6ImNrbTZxa2doYjBwbjkydncweWoxdHN2bHEifQ.TOXa2g6pYptNO2u77fcijw'
}).addTo(mymap);

const sse = new SSE('/api/sse');

sse.listen('newcity', (data) => {
  console.log('message', data);
  dataUpdate();
});

// dataUpdate();

