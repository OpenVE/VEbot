var http = require('https')
  , xml   = require('xml2json')
  , bot

exports.init = function(_bot) {
  bot = _bot

  setInterval(function() {
    http.get(bot.config.github.private_atom, gotResults)
  }, 1000 * 60 * 3) // 3 Minutes
}

function gotResults(res) {
  var data = ''
  res.on('data', function(chunk) {
    data += chunk
  })
  res.on('end', function() {
    bot.controller.githubFeed(JSON.parse(xml.toJson(data)))
  })
}
