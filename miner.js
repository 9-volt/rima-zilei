var request = require('request')
  , cheerio = require('cheerio')
  , fs = require('fs')

  // temporary variables
  , minedData = []
  , finishedSources = 0

  // Configuration data
  sources = [
    {
      title: 'unimedia'
    , url: 'http://unimedia.info/arhiva/stiri/17/04/2014'
      //, url: 'http://unimedia.info/arhiva/stiri/{{dd}}/{{mm}}/{{YYYY}}'
    , query: 'div > div > ul.no-list-type.fs14.bottom-separator > li > a.blue-orange'
    }
  ]

// Process each source
sources.forEach(function(source){
  (function(source){ // scope source variable
    request(source.url, function(err, resp, body) {
      if (err) throw err;

      $ = cheerio.load(body);
      $(source.query).each(function(index, element){
        minedData.push({
          phrase: $(this).text()
        , url: $(this).attr('href')
        })
      })

      finishSource()
    });
  })(source)
})

// Will increment finished sources flag
// If all sources are done than save data to file
function finishSource() {
  finishedSources += 1

  if (finishedSources >= sources.length) {
    // Save JSON to file
    fs.writeFile('./data_mined.json', JSON.stringify(minedData, null, 2), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to data_mined.json");
      }
    });
  }
}

var urlRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
function extractLink(str) {
  var match = str.match(urlRegex)

  if (match && match.length > 0) return match[0];
  return '';
}

// TODO limit by day (today or today an tomorrow)
// TODO add more sources
// TODO remove tags
// TODO parse links
// TODO remove descriptors from the beginning (ex. (video))
// TODO normalize diacritics
// TODO remove punctuation signs from the end of phrase
// TODO mark prhases with multiple propositions
*/
