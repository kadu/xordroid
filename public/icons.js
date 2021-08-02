var liveWeather = [];

function dataUpdate() {
  // fetch('http://localhost:3000/average/')
  //   .then((response) => response.json())
  //   .then((json) => {
  //     console.log(json);
  //     document.getElementById("max").innerHTML = json[0].MAX + " &ordm;C";
  //     document.getElementById("mid").innerHTML = json[0].MEDIA + " &ordm;C";;
  //     document.getElementById("min").innerHTML = json[0].MIN + " &ordm;C";;
  //   });

    fetch('http://localhost:3000/average2/')
    .then((response) => response.json())
    .then((json) => {
      console.log(json);

      document.getElementById("max").innerHTML = json[1].MIN + " &ordm;C" + " (" + json[1].city  + ")";
      document.getElementById("mid").innerHTML = json[0].MIN + " &ordm;C";
      document.getElementById("min").innerHTML = json[2].MIN + " &ordm;C" + " (" + json[2].city  + ")";
    });
}

dataUpdate();

const sse = new SSE('/api/sse');

sse.listen('newcity', (data) => {
  console.log('message', data);
  dataUpdate();
});