const dotenv = require('dotenv');
const bent = require('bent');
const getJSON = bent('json');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const WURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt_br&q=';
var db = null;

function sendSSEMessage(send) {
  send(
    'all',
    'newcity',
    {
      cool: true,
      content: 'This is a message sent ' + new Date().toLocaleTimeString()
    }
  );
}

async function createDB() {
  try {
    db = await sqlite.open({ filename: './databases/xordroid.db', driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS weathermap ( id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, video_time TEXT, username TEXT, city TEXT, lat TEXT, long TEXT, temp TEXT, temp_feelslike TEXT)`);
  } catch (error) {
    console.error(error);
  }
};

async function getStreamTime(obs) {
  return obs.send('GetStreamingStatus', {})
    .then( (value) => {
      return value.streamTimecode;
    })
    .catch( err => {
      return 0;
    });
}

createDB();

//api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

dotenv.config();
openWeatherKey = process.env.OPENWEATER_KEY;

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        let parsedMessage = message.split(" ");
        switch (parsedMessage[0]) {
            case '!tempo':
            case '!weather':
                let fullMessage = message.replace("!weather","").replace("!tempo","").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                let cidade = fullMessage;
                if(cidade == "") {
                  client.say(target, `@${context.username} você deve usar o !tempo seguido da sua cidade, exemplo para a cidade de São Paulo: !tempo são paulo`);
                  return;
                }
                let response = "";
                try {
                  response         = await getJSON(`${WURL}${cidade}&appid=${openWeatherKey}`);
                  const lon        = response.coord.lon;
                  const lat        = response.coord.lat;
                  const temp       = response.main.temp;
                  const feels_like = response.main.feels_like;
                  const temp_descr = response.weather[0].description;
                  const city       = response.name;
                  const country    = response.sys.country;
                  const username   = context.username;

                  const sql = 'SELECT  count(username) as ct FROM weathermap WHERE DATE("timestamp","-3 hour") = DATE("now","-3 hour") AND username = ? AND city = ?';
                  const params = [username, city];
                  const result = await db.get(sql, params, (err, row) => {
                    if (err) {
                      throw err;
                    }
                  });

                  if (result.ct == 0) {
                    await db.run("INSERT INTO weathermap (video_time, username, city, lat, long, temp, temp_feelslike)  VALUES(?,?,?,?,?,?,?)", [await getStreamTime(obs), context.username, city, lat, lon, temp, feels_like]);
                  }

                  const message = `${city}(${country}) temos ${temp}ºC com sensação térmica de ${feels_like}ºC. ${temp_descr}`;
                  client.say(
                      target,
                      message,
                  );
                  messages.push(`${city}(${country}) - ${temp}oC`);

                  sendSSEMessage(send);

                } catch (error) {
                  client.say(target, 'Não consegui achar sua cidade :/');
                  console.log(error);
                }
                break;
            default:
                break;
        }
    });
};

exports.dbweather = async () => {
  result = await db.all('select * from weathermap w where DATE("timestamp","-3 hour") = DATE("now","-3 hour")',[], (err, rows) => {
    if (err) {
      throw err;
    }
  });

  return (result);
}

exports.dbweather_resume = async () => {
  result = await db.all('select * from weathermap_resume',[], (err, rows) => {
    if (err) {
      throw err;
    }
  });

  return (result);
}


process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  db.close();
  process.exit();
});


/**
 *  CREATE VIEW weathermap_resume  AS
    SELECT
      AVG("temp") as MEDIA,
      MIN("temp") as MIN,
      MAX("temp") as MAX
    FROM
      weathermap
    where
      DATE("timestamp","-3 hour") = DATE("now","-3 hour")
 */