var request = require('request')
  , cheerio = require('cheerio')
  , fs = require('fs')

  // temporary variables
  , minedData = []
  , finishedSources = 0

  // Configuration data
  , sources = [
      {
        title: 'unimedia'
      , url: 'http://unimedia.info/arhiva/stiri/{{dd}}/{{mm}}/{{yyyy}}'
      , query: 'div > div > ul.no-list-type.fs14.bottom-separator > li > a.blue-orange'
      }
    ]
  , date = new Date()
  , isValidDate = function(d) {
      if ( Object.prototype.toString.call(d) !== "[object Date]" )
        return false;
      return !isNaN(d.getTime());
    }
  , pad = function(number, places) { // Works with max of 4 places
      return ('0000' + number).slice(-places)
    }

// Look for parameters
process.argv.forEach(function (val, index, array) {
  // Look for date
  if (val.indexOf('-date=') === 0) {
    var _date = new Date(val.replace('-date=', ''))
    if (isValidDate(_date)) {
      date = _date
    } else {
      console.error("Your date is invalid, using default date");
    }
  }
});

// Process each source
sources.forEach(function(source){
  (function(source){ // scope source variable
    // Parse url for date parameter
    var _url = source.url
    _url = _url.replace('{{dd}}', pad(date.getDate(), 2))
    _url = _url.replace('{{mm}}', pad(date.getMonth() + 1, 2))
    _url = _url.replace('{{yyyy}}', pad(date.getFullYear(), 4))

    request(_url, function(err, resp, body) {
      if (err) throw err;

      $ = cheerio.load(body);
      $(source.query).each(function(index, element){
        var text = $(this).text()
        text = removeTitleDescriptor(text)
        text = text.trim()
        text = removePunctuationFromEnd(text)

        minedData.push({
          phrase: text
        , url: $(this).attr('href')
        , multisentence: countSentences(text) > 1
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

// Remove descriptors from the beginning (ex. (video))
function removeTitleDescriptor(str) {
  return str.replace(/^\([\w\s\,]+\)\s+/i, '')
}

// Remove punctuation signs from the end of phrase
function removePunctuationFromEnd(str) {
  return str.replace(/[^\w]$/i, '')
}

// Count number of sentences in phrase
// Take in account that last sentence has no closing sign
function countSentences(str) {
  var match = str.match(/[\!\?\.]/ig)
  return match ? match.length : 1;
}

// TODO add more sources
// TODO normalize diacritics
