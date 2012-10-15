var http = require('http')
  , bot
  , options = {
      host : 'search.twitter.com'
    , path : '/search.json?q=OpenVE&rpp=5&result_type=recent'
    , method : 'GET'
    }
  , time = 1000 * 30 // 30 Seconds

exports.init = function(_bot) {
  bot = _bot
  makeRequests()
}

function makeRequests() {
  var req = http.request(options, gotResults)
  req.end()
  req.on('error', gotError)
}

function gotResults(res) {
  var data = ''
  res.on('data', function(chunk) {
    data += chunk
  })
  res.on('end', function() {
    try {
      data = JSON.parse(data)
    } catch(e) {
      return gotError(e)
    }
    bot.controller.twitterSearch(data)
    setTimeout(makeRequests, time)
  })
}

function gotError(error) {
  console.log(error)
  setTimeout(makeRequests, time)
}
