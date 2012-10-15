var http = require('http')
  , bot

exports.init = function(_bot) {
  bot = _bot

  setInterval(function() {
    http.get('http://search.twitter.com/search.json?q=OpenVE&rpp=5&result_type=recent', gotResults)
  }, 1000 * 60 * 0.5) // 30 Seconds
}

function gotResults(res) {
  var data = ''
  res.on('data', function(chunk) {
    data += chunk
  })
  res.on('end', function() {
    bot.controller.twitterSearch(JSON.parse(data))
  })
}
