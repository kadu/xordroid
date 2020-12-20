const requestp = require('request-promise');

let getCounter = async (channelUrl) => {
  let response = await requestp(channelUrl);
  let i = response.indexOf("inscritos");
  let corta = response.slice(i-100,i+100);
  let divide = corta.split(":");
  for (let index = 0; index < divide.length; index++) {
    let element = divide[index];
    if(element.indexOf("inscritos") > 0) {
      let parsed = element.split("\"");
      for (let index2 = 0; index2 < parsed.length; index2++) {
        const item = parsed[index2];
        if(item.indexOf("inscritos") > 0) {
          let getNum = item.split("0")[0].replace(new RegExp(String.fromCharCode(160),"g")," ");;
          let test = getNum.split(" ")[0];
          return test;
        }

      }
      return -1;
    }
  }
  return -1;
}

export { getCounter };


// (async () => {
//   let youtubeChannelUrl = 'https://www.youtube.com/channel/UC3pkYuCPdMK7aEqYXcatzNQ';
//   console.log(await getCounter(youtubeChannelUrl));
// })();