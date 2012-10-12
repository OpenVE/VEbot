var http = require('http')
  , bot

exports.init = function(_bot) {
  bot = _bot

  setInterval(function() {
    http.get('http://search.twitter.com/search.json?q=OpenVE&rpp=5&result_type=recent', gotTwitterResults)
  }, 1000 * 60 * 1) // 1 minute
}

function gotTwitterResults(res) {
  var data = ''
  res.on('data', function(chunk) {
    data += chunk
  })
  res.on('end', function() {
    bot.controller.twitterSearch(JSON.parse(data))
  })
}
