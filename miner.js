var Config = {
    api_key: 'StdgFCh9MruRVxIpsfFRY6ldR'
  , api_secret: 'qrWKJTknqOuOtHbGreGHn6WXkPz316jidKsEZpoidl7AkOP9OH'
  , access_token: '18399704-96fcLw8Rlb7azq3lIT1pfLyZuLVkdyYBdSEDBLvqU'
  , access_token_secret: 'Tsdhhzh6gWaBReAA6Lr7YEncEv8Kr3cDY613W1cKZrEay'
  }
  , OAuth = require('OAuth')
  , fs = require('fs');

var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  Config.api_key,
  Config.api_secret,
  '1.0A',
  null,
  'HMAC-SHA1'
);
oauth.get(
  'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=unimedia',
  Config.access_token,
  Config.access_token_secret,
  function (e, data, res){
    if (e) console.error(e);

    var dataParsed = JSON.parse(data)
    var usefulData = []

    for (var d in dataParsed) {
      usefulData.push({
        phrase: dataParsed[d].text
      , url: ''
      , created_at: dataParsed[d].created_at
      })
    }

    // console.log(usefulData)

    fs.writeFile('./data_mined.json', JSON.stringify(usefulData), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to data_mined.json");
      }
    });
  }
);

// TODO limit by day (today or today an tomorrow)
// TODO add more sources
// TODO remove tags
// TODO parse links
// TODO remove descriptors from the beginning (ex. (video))
// TODO normalize diacritics
// TODO remove punctuation signs from the end of phrase
// TODO mark prhases with multiple propositions
