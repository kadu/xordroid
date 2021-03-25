var liveWeather = [];

function dataUpdate() {
  fetch('http://localhost:3000/average/')
    .then((response) => response.json())
    .then((json) => {
      document.getElementById("max").innerHTML = json[0].MAX + " &ordm;C";
      document.getElementById("mid").innerHTML = json[0].MEDIA + " &ordm;C";;
      document.getElementById("min").innerHTML = json[0].MIN + " &ordm;C";;
    });
}

dataUpdate();

const sse = new SSE('/api/sse');

sse.listen('newcity', (data) => {
  console.log('message', data);
  dataUpdate();
});