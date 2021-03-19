function dataUpdate() {
  fetch('http://localhost:3000/api/')
  .then((response) => response.json())
  .then((json) => {
    json.map((row) =>{
      L.marker([row.lat,row.long]).addTo(mymap)
      .bindPopup(`<b>${row.city}</b><br />${row.temp}ºC`).openPopup();
    });
  });
}


var mymap = L.map('mapid').setView([-22.564848,-47.4094343], 3);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}

mymap.on('click', onMapClick);

const sse = new SSE('/api/sse');

sse.listen('newcity', (data) => {
  console.log('message', data);
  dataUpdate();
});


